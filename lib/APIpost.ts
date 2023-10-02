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
  getDoc,
} from "firebase/firestore";
import firestore from "@react-native-firebase/firestore";
import { IPost, IComment } from "./types";

export async function addPost(post: IPost, callback: saveDone) {
  console.log("addPost: FBJS");

  const docRef = await addDoc(
    collection(db, "projects", post.projectId, "posts"),
    {
      author: post.author,
      avatar:
        "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FScreenshot%202023-05-30%20at%202.47.44%20PM.png?alt=media&token=30888878-15e6-4395-b3d4-53ae17758e33&_gl=1*pyfxsn*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ1MDg3Ni44LjEuMTY4NTQ1MDkxMS4wLjAuMA..",
      images: post.images,
      ratio: Number(post.ratio),
      timestamp: Timestamp.now(),
    },
  );

  // get all the users in the project from firebase
  // for each user, add a notification to the notifications collection

  if (post.author != "Simon") {
    const messageRef = await addDoc(collection(db, "notifications"), {
      title: post.author + ": " + post.projectTitle,
      body: "New Post Added",
      timestamp: Timestamp.now(),
    });
  }

  callback(docRef.id);

  return;
}

export function updatePost(post: IPost, callback: saveDone) {
  console.log("updatePost: FBJS");

  const postRef = doc(db, "projects", post.projectId, "posts", post.key);
  updateDoc(postRef, {
    caption: post.caption,
  }).then(() => {
    callback(post.key);
  });
}

export function deletePost(post: IPost, callback: saveDone) {
  console.log("deletePost: FBJS");

  const postRef = doc(db, "projects", post.projectId, "posts", post.key);
  deleteDoc(postRef).then(() => {
    callback(post.key);
  });
}

export async function getPosts(
  projectId: string | null | undefined,
  callback: postsRead,
) {
  console.log("getPosts: FBNATIVE");

  if (undefined === projectId || null === projectId || "" === projectId) {
    projectId = "void";
  }

  // const q = query(
  //   collection(db, "projects", projectId, "posts"),
  //   orderBy("timestamp", "desc"),
  // );

  const q = firestore()
    .collection("projects")
    .doc(projectId)
    .collection("posts")
    .orderBy("timestamp", "desc");

  const unsubscribe = q.onSnapshot((querySnapshot) => {
    const posts: IPost[] = [];
    querySnapshot.forEach((doc) => {
      console.log("getPosts onSnapshot: FBNATIVE");

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

  // const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //   const posts: IPost[] = [];
  //   querySnapshot.forEach((doc) => {
  //     console.log("getPosts onSnapshot: FBJS");

  //     posts.push({
  //       key: doc.id,
  //       projectId: projectId,
  //       author: doc.data().author,
  //       images: doc.data().images,
  //       ratio: doc.data().ratio,
  //       timestamp: doc.data().timestamp,
  //       caption: doc.data().caption,
  //     });
  //   });
  //   callback(posts);
  // });

  return () => unsubscribe();
}

export async function getComments(projectId: string, postId: string) {
  console.log("getComments: FBNATIVE");

  const comments: IComment[] = [];

  // const qComments = query(
  //   collection(db, "projects", projectId, "posts", postId, "comments"),
  //   orderBy("timestamp", "asc"),
  // );

  const qComments = firestore()
    .collection("projects")
    .doc(projectId)
    .collection("posts")
    .doc(postId)
    .collection("comments")
    .orderBy("timestamp", "asc");

  const commentsSnapshot = await qComments.get();

  commentsSnapshot.forEach((doc) => {
    comments.push({
      key: doc.id,
      comment: doc.data().comment,
      displayName: doc.data().displayName,
      timestamp: doc.data().timestamp,
      uid: doc.data().uid,
    });
  });

  //console.log("comments: ", comments);

  return comments;
}

export async function addComment(
  project: string,
  post: string,
  comment: IComment,
  callback: { (comment: IComment): void; (arg0: string): void },
) {
  console.log("addComment: FBJS");

  const docRef = await addDoc(
    collection(db, "projects", project, "posts", post, "comments"),
    comment,
  );

  const newData = { key: docRef.id };

  const projectRef = doc(db, "projects", project);
  const projectDoc = await getDoc(projectRef);
  const projectData = projectDoc.data();

  const messageRef = await addDoc(collection(db, "notifications"), {
    title: comment.displayName + ": " + projectData?.title,
    body: comment.comment,
    timestamp: Timestamp.now(),
    uid: comment.uid,
  });

  console.log("callback: ", { ...comment, ...newData });

  callback({ ...comment, ...newData });

  return;
}
