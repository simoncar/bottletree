import { firestore } from "./firebase";
import { IPost, IComment } from "./types";

export async function addPost(post: IPost, callback: saveDone) {
  firestore()
    .collection("projects")
    .doc(post.projectId)
    .collection("posts")
    .add({
      author: post.author,
      avatar:
        "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FScreenshot%202023-05-30%20at%202.47.44%20PM.png?alt=media&token=30888878-15e6-4395-b3d4-53ae17758e33&_gl=1*pyfxsn*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ1MDg3Ni44LjEuMTY4NTQ1MDkxMS4wLjAuMA..",
      images: post.images,
      ratio: Number(post.ratio),
      timestamp: firestore.Timestamp.now(),
    })
    .then((docRef) => {
      console.log("Post Document written with ID: ", docRef.id);
      if (post.author != "Simon") {
        const messageRef = firestore()
          .collection("notifications")
          .add({
            title: post.author + ": " + post.projectTitle,
            body: "New Post Added",
            timestamp: firestore.Timestamp.now(),
          })
          .then((docRef) => {
            console.log("Notification Document written with ID: ", docRef.id);
            callback(docRef.id);
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      } else {
        callback(docRef.id);
      }
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });

  return;
}

export function updatePost(post: IPost, callback: saveDone) {
  const postRef = firestore()
    .collection("projects")
    .doc(post.projectId)
    .collection("posts")
    .doc(post.key);

  postRef
    .set(
      {
        caption: post.caption,
      },
      { merge: true },
    )
    .then(() => {
      callback(post.key);
    });
}

export function deletePost(post: IPost, callback: saveDone) {
  const postRef = firestore()
    .collection("projects")
    .doc(post.projectId)
    .collection("posts")
    .doc(post.key);

  postRef.delete().then(() => {
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

  const q = firestore()
    .collection("projects")
    .doc(projectId)
    .collection("posts")
    .orderBy("timestamp", "desc");

  const unsubscribe = q.onSnapshot((querySnapshot) => {
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
      console.log("Comments written with ID: ", docRef.id);
      const newData = { key: docRef.id };

      const projectDoc = firestore().collection("projects").doc(project);
      projectDoc.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          const projectData = doc.data();

          firestore()
            .collection("notifications")
            .add({
              title: comment.displayName + ": " + projectData?.title,
              body: comment.comment,
              timestamp: firestore.Timestamp.now(),
              uid: comment.uid,
            });

          callback({ ...comment, ...newData });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      });
    });

  return;
}
