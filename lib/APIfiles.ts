import { db, dbm, firestore, storage } from "@/lib/firebase"; // or "@/lib/firebase.web"
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "@react-native-firebase/firestore";
import * as Crypto from "expo-crypto";
import * as DocumentPicker from "expo-document-picker";
import { Platform } from "react-native";
import { setPostFile } from "./APIpost";
import { IFile, IPost, IUser } from "./types";

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
export async function deleteFile(
  projectId: string,
  key: string,
  callback: (id: string) => void,
) {
  try {
    const docRef = doc(
      collection(doc(collection(dbm, "projects"), projectId), "files"),
      key,
    );

    await dbm.runTransaction(async (transaction) => {
      transaction.delete(docRef);
    });

    callback(key);
  } catch (e) {
    console.error("Error deleting file from project: ", e);
  }
}
export async function getFiles(project: string, callback: filesRead) {
  const filesRef = collection(
    doc(collection(dbm, "projects"), project),
    "files",
  );
  const q = query(filesRef, orderBy("modified", "desc"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const files: IFile[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      files.push({
        key: docSnap.id,
        filename: data.filename,
        url: data.url,
        mimeType: data.mimeType,
        bytes: data.bytes,
        created: data.created,
        modified: data.modified,
        projectId: data.projectId,
      });
    });

    callback(files);
  });

  return unsubscribe;
}

export async function uploadFilesAndCreateEntries(
  filesJson: DocumentPicker.DocumentPickerResult,
  projectId: string,
  user: IUser,
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
      let fileRef;
      if (Platform.OS === "web") {
        fileRef = storage.child(`project/${projectId}/files/${UUID}`);
      } else {
        fileRef = storage().ref(`project/${projectId}/files/${UUID}`);
      }

      // Upload the Blob
      try {
        await fileRef.put(blob);
      } catch (error) {
        if (error.code === "storage/unauthorized") {
          console.error("User does not have permission to access the object");
        } else {
          throw error;
        }
      }

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
      const post: IPost = {
        key: UUID,
        caption: `${file.name}`,
        projectId,
        author: user.displayName,
        uid: user.uid,
        timestamp: firestore.Timestamp.now(),
        ratio: 1,
        file: UUID,
      };

      setPostFile(post, (postId) => {
        console.log(`Post created with ID: ${postId}`);
      });

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
