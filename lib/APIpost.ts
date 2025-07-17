import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "@react-native-firebase/firestore";
import { dbm } from "./firebase";
import { IComment, IPost } from "./types";
import { parseImages } from "@/lib/util";

export async function getPost(
  project: string,
  postId: string,
  callback: (post: IPost) => void,
) {
  const postRef = doc(dbm, "projects", project, "posts", postId);

  try {
    const docSnap = await getDoc(postRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const post: IPost = {
        key: docSnap.id,
        projectId: project,
        projectTitle: data?.projectTitle,
        caption: data?.caption,
        author: data?.author,
        images: parseImages(data?.images) ?? [],
        ratio: data?.ratio,
        timestamp: data?.timestamp,
        linkURL: data?.linkURL,
        file: data?.file || "",
      };
      callback(post);
    } else {
      console.log("No such post:", project, postId);
    }
  } catch (error) {
    console.error("Error getting post:", error);
  }
}

export async function addPostImage(post: IPost, callback: any) {
  try {
    const postRef = await addDoc(
      collection(dbm, "projects", post.projectId, "posts"),
      {
        author: post.author,
        avatar:
          "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FScreenshot%202023-05-30%20at%202.47.44%20PM.png?alt=media&token=30888878-15e6-4395-b3d4-53ae17758e33&_gl=1*pyfxsn*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ1MDg3Ni44LjEuMTY4NTQ1MDkxMS4wLjAuMA..",
        images: post.images,
        ratio: Number(post.ratio),
        timestamp: serverTimestamp(),
        uid: post.uid || "",
      },
    );
    console.log("Post Document written with ID: ", postRef.id);
    console.log(
      "******* SENDING NOTIFICATION ******* :",
      post.author.substring(0, 5),
    );

    const notificationRef = await addDoc(collection(dbm, "notifications"), {
      title: post.author,
      body: "New Image Added",
      timestamp: serverTimestamp(),
      projectId: post.projectId,
      uid: post.uid || "",
    });
    console.log("Notification Document written with ID: ", notificationRef.id);
    callback(notificationRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

export async function setPostNote(post: IPost, callback: any) {
  try {
    const noteRef = doc(dbm, "projects", post.projectId, "posts", post.key);

    await setDoc(noteRef, {
      author: post.author,
      avatar:
        "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FScreenshot%202023-05-30%20at%202.47.44%20PM.png?alt=media&token=30888878-15e6-4395-b3d4-53ae17758e33&_gl=1*pyfxsn*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ1MDg3Ni44LjEuMTY4NTQ1MDkxMS4wLjAuMA..",
      caption: post.caption,
      timestamp: serverTimestamp(),
      uid: post.uid || "",
    });

    console.log("Post Document written with ID: ", post.key);

    const notificationRef = await addDoc(collection(dbm, "notifications"), {
      title: post.author?.substring(0, 300) || "",
      body: post.caption?.substring(0, 300) || "",
      timestamp: serverTimestamp(),
      projectId: post.projectId,
      uid: post.uid || "",
    });

    callback(notificationRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

export async function setPostFile(post: IPost, callback: any) {
  try {
    const noteRef = doc(dbm, "projects", post.projectId, "posts", post.key);

    await setDoc(noteRef, {
      author: post.author,
      avatar:
        "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FScreenshot%202023-05-30%20at%202.47.44%20PM.png?alt=media&token=30888878-15e6-4395-b3d4-53ae17758e33&_gl=1*pyfxsn*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ1MDg3Ni44LjEuMTY4NTQ1MDkxMS4wLjAuMA..",
      caption: post.caption,
      timestamp: serverTimestamp(),
      uid: post.uid,
      file: post.file,
    });

    console.log("Post Document written with ID: ", post.key);

    const notificationRef = await addDoc(collection(dbm, "notifications"), {
      title: post.author,
      body: "New File Added",
      timestamp: serverTimestamp(),
      projectId: post.projectId,
      uid: post.uid || "",
    });

    callback(notificationRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
export async function updatePost(post: IPost, callback: any) {
  const postRef = doc(dbm, "projects", post.projectId, "posts", post.key);

  const postData = Object.fromEntries(
    Object.entries(post).filter(([_, v]) => v !== undefined),
  );

  await setDoc(postRef, postData, { merge: true });
  callback(post.key);
}
export async function deletePost(post: IPost, callback: any) {
  const postRef = doc(dbm, "projects", post.projectId, "posts", post.key);

  await deleteDoc(postRef);
  callback(post.key);
}

export async function getPosts(
  project: string | null | undefined,
  callback: any,
) {
  if (undefined === project || null === project || "" === project) {
    project = "void";
  }

  const postsCollection = collection(dbm, "projects", project, "posts");
  const postsQuery = query(postsCollection, orderBy("timestamp", "desc"));

  const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
    const posts: IPost[] = [];
    querySnapshot?.forEach((doc) => {
      posts.push({
        key: doc.id,
        projectId: project,
        author: doc.data().author,
        images: parseImages(doc.data().images) ?? [],
        ratio: doc.data().ratio ?? 1,
        timestamp: doc.data().timestamp,
        caption: doc.data().caption,
        linkURL: doc.data().linkURL ?? "",
        uid: doc.data().uid ?? "",
        file: doc.data().file ?? "",
      });
    });

    callback(posts);
  });

  return () => unsubscribe();
}

export async function getComments(project: string, postId: string) {
  const comments: IComment[] = [];

  const commentsRef = collection(
    dbm,
    "projects",
    project,
    "posts",
    postId,
    "comments",
  );
  const qComments = query(commentsRef, orderBy("timestamp", "asc"));

  const commentsSnapshot = await getDocs(qComments);

  commentsSnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    comments.push({
      key: docSnap.id,
      comment: data.comment !== null ? data.comment : "",
      displayName: data.displayName,
      timestamp: data.timestamp,
      uid: data.uid,
    });
  });

  return comments;
}
export async function addComment(
  project: string,
  post: string,
  comment: IComment,
  callback: { (comment: IComment): void; (arg0: string): void },
) {
  try {
    const commentsCollection = collection(
      dbm,
      "projects",
      project,
      "posts",
      post,
      "comments",
    );

    // Ensure the timestamp is set on the server using the modular API
    const commentData = {
      ...comment,
      timestamp: serverTimestamp(),
    };

    const docRef = await addDoc(commentsCollection, commentData);
    const newData = { key: docRef.id };

    const projectDocRef = doc(dbm, "projects", project);
    const projectDocSnap = await getDoc(projectDocRef);

    if (projectDocSnap.exists()) {
      await addDoc(collection(dbm, "notifications"), {
        title: comment.displayName?.substring(0, 300) || "",
        body: comment.comment?.substring(0, 300) || "",
        timestamp: serverTimestamp(),
        uid: comment.uid,
        projectId: project,
      });

      callback({ ...comment, ...newData });
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error adding comment: ", error);
  }
}
