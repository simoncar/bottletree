import { storage, firestore } from "@/lib/firebase";
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

export async function getFiles(project: string, callback: filesRead) {
  const files: IFile[] = [];

  const q = firestore()
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

  const storageRef = storage().ref();
  const projectFilesRef = firestore()
    .collection("projects")
    .doc(projectId)
    .collection("files");

  for (const file of filesJson.assets) {
    try {
      const UUID = Crypto.randomUUID();
      // Upload file to Firebase Storage
      const fileRef = storageRef.child(`project/${projectId}/files/${UUID}`);
      const response = await uriToBlob(file.uri);
      const blob = await response;
      await fileRef.put(blob);

      // Get the download URL
      const downloadURL = await fileRef.getDownloadURL();

      // Create an entry in Firestore
      const fileEntry: IFile = {
        key: UUID,
        filename: file.name,
        url: downloadURL,
        mimeType: file.mimeType,
        bytes: file.size,
        created: firestore.Timestamp.now(),
        modified: firestore.Timestamp.now(),
        projectId: projectId,
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

    // If successful -> return with blob
    xhr.onload = function () {
      resolve(xhr.response);
    };

    // reject on error
    xhr.onerror = function () {
      reject(new Error("uriToBlob failed"));
    };

    // Set the response type to 'blob' - this means the server's response
    // will be accessed as a binary object
    xhr.responseType = "blob";

    // Initialize the request. The third argument set to 'true' denotes
    // that the request is asynchronous
    xhr.open("GET", uri, true);

    // Send the request. The 'null' argument means that no body content is given for the request
    xhr.send(null);
  });
}
