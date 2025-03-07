import { db, storage, firestore } from "@/lib/firebase"; // or "@/lib/firebase.web"
import { IFile } from "./types";
import * as Crypto from "expo-crypto";
import * as DocumentPicker from "expo-document-picker";

type FileData = {
  mimeType: string;
  name: string;
  size: number;
  uri: string;
};

type FilesJson = {
  assets: FileData[];
  canceled: boolean;
};

export function deleteFile(
  projectId: string,
  key: string,
  callback: { (id: string): void; (arg0: string): void },
) {
  try {
    const docRef = db
      .collection("projects")
      .doc(projectId)
      .collection("files")
      .doc(key);

    docRef.delete().then(() => {
      callback(key);
    });
  } catch (e) {
    console.error("Error deleting user from project: ", e);
  }

  return;
}

export async function getFiles(project: string, callback: filesRead) {
  const files: IFile[] = [];

  const q = db
    .collection("projects")
    .doc(project)
    .collection("files")
    .orderBy("modified", "desc");

  const unsubscribe = q.onSnapshot((querySnapshot) => {
    const files: IFile[] = [];
    querySnapshot?.forEach((doc) => {
      files.push({
        key: doc.id,
        filename: doc.data().filename,
        url: doc.data().url,
        mimeType: doc.data().mimeType,
        bytes: doc.data().bytes,
        created: doc.data().created,
        modified: doc.data().modified,
        projectId: doc.data().projectId,
      });
    });

    callback(files);
  });
  return () => unsubscribe();
}

export async function uploadFilesAndCreateEntries(
  filesJson: DocumentPicker.DocumentPickerResult,
  projectId: string,
) {
  if (filesJson.canceled) {
    console.log("File selection was canceled.");
    return;
  }

  const projectFilesRef = db
    .collection("projects")
    .doc(projectId)
    .collection("files");

  for (const file of filesJson.assets) {
    try {
      const UUID = Crypto.randomUUID();

      // Convert URI to Blob
      const blob = await uriToBlob(file.uri);

      // Storage reference
      const fileRef = storage.child(`project/${projectId}/files/${UUID}`);

      // Upload the Blob
      await fileRef.put(blob);

      // Download URL
      const downloadURL = await fileRef.getDownloadURL();

      // Create Firestore entry
      const fileEntry: IFile = {
        key: UUID,
        filename: file.name,
        url: downloadURL,
        mimeType: file.mimeType,
        bytes: file.size,
        created: firestore.Timestamp.now(),
        modified: firestore.Timestamp.now(),
        projectId,
      };

      await projectFilesRef.add(fileEntry);

      console.log(`File ${file.name} uploaded and entry created in Firestore.`);
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
    }
  }
}

export function uriToBlob(uri: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new Error("uriToBlob failed"));
    };

    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
}
