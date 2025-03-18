import { db, firestore } from "./firebase";
import { IComment, IPost } from "./types";

export async function getPost(
  project: string,
  postId: string,
  callback: { (post: IPost): void; (arg0: IPost): void },
) {
  const q = db
    .collection("projects")
    .doc(project)
    .collection("posts")
    .doc(postId);

  q.get().then((doc) => {
    if (doc.exists) {
      const post: IPost = {
        key: doc.id,
        projectId: project,
        projectTitle: doc.data()?.projectTitle,
        caption: doc.data()?.caption,
        author: doc.data()?.author,
        images: doc.data()?.images,
        ratio: doc.data()?.ratio,
        timestamp: doc.data()?.timestamp,
        linkURL: doc.data()?.linkURL,
      };
      callback(post);
    } else {
      console.log("No such post:", project, postId);
    }
  });
}

export async function addPostImage(post: IPost, callback: any) {
  db.collection("projects")
    .doc(post.projectId)
    .collection("posts")
    .add({
      author: post.author,
      avatar:
        "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FScreenshot%202023-05-30%20at%202.47.44%20PM.png?alt=media&token=30888878-15e6-4395-b3d4-53ae17758e33&_gl=1*pyfxsn*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ1MDg3Ni44LjEuMTY4NTQ1MDkxMS4wLjAuMA..",
      images: post.images,
      ratio: Number(post.ratio),
      timestamp: firestore.Timestamp.now(),
      uid: post.uid || "",
    })
    .then((docRef) => {
      console.log("Post Document written with ID: ", docRef.id);
      console.log(
        "******* SENDING NOTIFICATION ******* :",
        post.author.substring(0, 5),
      );

      db.collection("notifications")
        .add({
          title: post.author,
          body: "New Image Added",
          timestamp: firestore.Timestamp.now(),
          projectId: post.projectId,
          uid: post.uid || "",
        })
        .then((docRef) => {
          console.log("Notification Document written with ID: ", docRef.id);
          callback(docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });

  return;
}

export async function setPostNote(post: IPost, callback: any) {
  const note = db
    .collection("projects")
    .doc(post.projectId)
    .collection("posts")
    .doc(post.key);

  note
    .set({
      author: post.author,
      avatar:
        "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FScreenshot%202023-05-30%20at%202.47.44%20PM.png?alt=media&token=30888878-15e6-4395-b3d4-53ae17758e33&_gl=1*pyfxsn*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ1MDg3Ni44LjEuMTY4NTQ1MDkxMS4wLjAuMA..",
      caption: post.caption,
      timestamp: firestore.Timestamp.now(),
      uid: post.uid || "",
    })
    .then(() => {
      console.log("Post Document written with ID: ", post.key);
      db.collection("notifications")
        .add({
          title: post.author?.substring(0, 300) || "",
          body: post.caption?.substring(0, 300) || "",
          timestamp: firestore.Timestamp.now(),
          projectId: post.projectId,
          uid: post.uid || "",
        })
        .then((docRef) => {
          callback(docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });

  return;
}

export async function setPostFile(post: IPost, callback: any) {
  const note = db
    .collection("projects")
    .doc(post.projectId)
    .collection("posts")
    .doc(post.key);

  note
    .set({
      author: post.author,
      avatar:
        "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FScreenshot%202023-05-30%20at%202.47.44%20PM.png?alt=media&token=30888878-15e6-4395-b3d4-53ae17758e33&_gl=1*pyfxsn*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ1MDg3Ni44LjEuMTY4NTQ1MDkxMS4wLjAuMA..",
      caption: post.caption,
      timestamp: firestore.Timestamp.now(),
      uid: post.uid,
    })
    .then(() => {
      console.log("Post Document written with ID: ", post.key);
      db.collection("notifications")
        .add({
          title: post.author,
          body: "New File Added",
          timestamp: firestore.Timestamp.now(),
          projectId: post.projectId,
          uid: post.uid || "",
        })
        .then((docRef) => {
          callback(docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });

  return;
}

export function updatePost(post: IPost, callback: any) {
  const postRef = db
    .collection("projects")
    .doc(post.projectId)
    .collection("posts")
    .doc(post.key);

  const postData = Object.fromEntries(
    Object.entries(post).filter(([_, v]) => v !== undefined),
  );

  postRef.set(postData, { merge: true }).then(() => {
    callback(post.key);
  });
}

export function deletePost(post: IPost, callback: any) {
  const postRef = firestore()
    .collection("projects")
    .doc(post.projectId)
    .collection("posts")
    .doc(post.key);

  postRef.delete().then(() => {
    callback(post.key);
  });
}

function containsAsteriskBeforeHttp(str) {
  const httpIndex = str.indexOf("http");
  if (httpIndex === -1) {
    return false; // "http" not found in the string
  }

  const substringBeforeHttp = str.substring(0, httpIndex);
  return substringBeforeHttp.includes("*");
}

function splitOnFirst(str, character) {
  const index = str.indexOf(character);

  if (index === -1) {
    return [str]; // The character is not found, return the original string in an array
  }

  return [str.substring(0, index), str.substring(index + 1)];
}

export function parseImages(images: string[]) {
  const parsedImages: { ratio: number; url: string }[] = [];

  if (images === undefined || images.length === 0) {
    return [];
  }
  images.forEach((image) => {
    if (containsAsteriskBeforeHttp(image)) {
      const parts = splitOnFirst(image, "*");
      parsedImages.push({ ratio: Number(parts[0]), url: parts[1] });
    } else {
      parsedImages.push({ ratio: 1, url: image });
    }
  });

  return parsedImages;
}

export async function getPosts(
  project: string | null | undefined,
  callback: any,
) {
  if (undefined === project || null === project || "" === project) {
    project = "void";
  }

  const q = firestore()
    .collection("projects")
    .doc(project)
    .collection("posts")
    .orderBy("timestamp", "desc");

  const unsubscribe = q.onSnapshot((querySnapshot) => {
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
      });
    });

    callback(posts);
  });

  return () => unsubscribe();
}

export async function getComments(project: string, postId: string) {
  const comments: IComment[] = [];

  const qComments = firestore()
    .collection("projects")
    .doc(project)
    .collection("posts")
    .doc(postId)
    .collection("comments")
    .orderBy("timestamp", "asc");

  const commentsSnapshot = await qComments.get();

  commentsSnapshot.forEach((doc) => {
    comments.push({
      key: doc.id,
      comment: doc.data().comment !== null ? doc.data().comment : "",
      displayName: doc.data().displayName,
      timestamp: doc.data().timestamp,
      uid: doc.data().uid,
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
  firestore()
    .collection("projects")
    .doc(project)
    .collection("posts")
    .doc(post)
    .collection("comments")
    .add(comment)
    .then((docRef) => {
      const newData = { key: docRef.id };

      const projectDoc = firestore().collection("projects").doc(project);
      projectDoc.get().then((doc) => {
        if (doc.exists) {
          const projectData = doc.data();

          firestore()
            .collection("notifications")
            .add({
              title: comment.displayName?.substring(0, 300) || "",
              body: comment.comment?.substring(0, 300) || "",
              timestamp: firestore.Timestamp.now(),
              uid: comment.uid,
              projectId: project,
            });

          callback({ ...comment, ...newData });
        } else {
          console.log("No such document!");
        }
      });
    });

  return;
}
