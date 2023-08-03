import { db } from "./firebase";
import {
  collection,
  query,
  addDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
  orderBy,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { IPost, IComment } from "./types";

export function addPost(post: IPost, callback: saveDone) {
  try {
    const docRef = addDoc(collection(db, "projects", post.projectId, "posts"), {
      author: "Ada",
      avatar:
        "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FScreenshot%202023-05-30%20at%202.47.44%20PM.png?alt=media&token=30888878-15e6-4395-b3d4-53ae17758e33&_gl=1*pyfxsn*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ1MDg3Ni44LjEuMTY4NTQ1MDkxMS4wLjAuMA..",
      images: post.images,
      ratio: Number(post.ratio),
      timestamp: Timestamp.now(),
    }).then((docRef) => {
      callback(docRef.id);
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }

  return;
}

export function updatePost(post: IPost, callback: saveDone) {
  const postRef = doc(db, "projects", post.projectId, "posts", post.key);
  updateDoc(postRef, {
    caption: post.caption,
  }).then(() => {
    callback(post.key);
  });
}

export function deletePost(post: IPost, callback: saveDone) {
  const postRef = doc(db, "projects", post.projectId, "posts", post.key);
  deleteDoc(postRef).then(() => {
    callback(post.key);
  });
}

export async function getPosts(
  projectId: string | null | undefined,
  callback: postsRead,
) {
  if (undefined === projectId || null === projectId || "" === projectId) {
    projectId = "void";
  }

  const q = query(
    collection(db, "projects", projectId, "posts"),
    orderBy("timestamp", "desc"),
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const posts: IPost[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        key: doc.id,
        projectId: projectId,
        author: doc.data().author,
        images: doc.data().images,
        ratio: doc.data().ratio,
        timestamp: doc.data().timestamp,
        caption: doc.data().caption,
      });
    });
    callback(posts);
  });

  return () => unsubscribe();
}

export async function getComments(projectId: string, postId: string) {
  const comments: IComment[] = [];

  const qComments = query(
    collection(db, "projects", projectId, "posts", postId, "comments"),
    orderBy("timestamp", "asc"),
  );

  const commentsSnapshot = await getDocs(qComments);
  commentsSnapshot.forEach((doc) => {
    comments.push({
      key: doc.id,
      comment: doc.data().comment,
      displayName: doc.data().displayName,
      timestamp: doc.data().timestamp,
      uid: doc.data().uid,
    });
  });

  return comments;
}

export function addComment(
  project: string,
  post: string,
  comment: IComment,
  callback: { (comment: IComment): void; (arg0: string): void },
) {
  try {
    addDoc(
      collection(db, "projects", project, "posts", post, "comments"),
      comment,
    ).then((docRef) => {
      const newData = { key: docRef.id };

      console.log("callback: ", { ...comment, ...newData });

      callback({ ...comment, ...newData });
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }

  return;
}
