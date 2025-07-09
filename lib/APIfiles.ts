import { dbm } from "@/lib/firebase"; // or "@/lib/firebase.web"
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "@react-native-firebase/firestore";

// import {
//   getDownloadURL,
//   getStorage,
//   ref as storageRef,
// } from "@react-native-firebase/storage";
import storage, { getDownloadURL } from "@react-native-firebase/storage";

import * as Crypto from "expo-crypto";
import * as DocumentPicker from "expo-document-picker";
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

  const projectFilesRef = collection(doc(dbm, "projects", projectId), "files");
  console.log("uploadFilesAndCreateEntries - modular:", filesJson);

  for (const file of filesJson.assets) {
    try {
      const UUID = Crypto.randomUUID();
      //const blob = await uriToBlob(file.uri);

      const filePath = `project/${projectId}/files/${UUID}`;
      const fileStorageRef = storage().ref(filePath);

      try {
        console.log("AAA111- fileStorageRef.putFile");
        await fileStorageRef.putFile(file.uri);
        console.log("AAA222- fileStorageRef.putFile");
        //await uploadBytes(fileStorageRef, blob);
      } catch (error: any) {
        if (error.code === "storage/unauthorized") {
          console.error("User does not have permission to access the object");
        } else {
          throw error;
        }
      }

      const downloadURL = await getDownloadURL(fileStorageRef);

      const fileEntry: IFile = {
        key: UUID,
        filename: file.name,
        url: downloadURL,
        mimeType: file.mimeType,
        bytes: file.size,
        created: serverTimestamp(),
        modified: serverTimestamp(),
        projectId,
      };

      await addDoc(projectFilesRef, fileEntry);

      const post: IPost = {
        key: UUID,
        caption: `${file.name}`,
        projectId,
        author: user.displayName,
        uid: user.uid,
        timestamp: serverTimestamp(),
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
