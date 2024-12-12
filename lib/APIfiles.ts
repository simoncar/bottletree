import { db, firestore } from "./firebase";
import { IFile } from "./types";

export async function getFiles(project: string, callback: filesRead) {
  const files: IFile[] = [];

  const q = firestore()
    .collection("projects")
    .doc(project)
    .collection("files")
    .orderBy("modified", "desc");

  const logSnapshot = await q.get();

  logSnapshot.forEach((doc) => {
    console.log("loop files:", doc);
    files.push({
      key: doc.id,
      filename: doc.data().filename,
      url: doc.data().url,
      filetype: doc.data().filetype,
      bytes: doc.data().bytes,
      created: doc.data().created,
      modified: doc.data().modified,
      projectId: doc.data().projectId,
    });
  });

  callback(files);
}
