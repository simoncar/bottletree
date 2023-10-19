import { auth, firestore } from "../lib/firebase";
import { IUser } from "./types";

export const updateAccountName = (displayName: string) => {
  const docRef1 = firestore().collection("users").doc(auth().currentUser.uid);

  const user = auth().currentUser;
  const docRef2 = user
    .updateProfile({
      displayName: displayName,
    })
    .then(() => {
      docRef1.set(
        {
          displayName: displayName,
          email: auth().currentUser.email,
          photoURL: auth().currentUser.photoURL,
          postCount: {
            project22222222: 4,
          },
        },
        { merge: true },
      );
    })
    .catch((error) => {
      console.log("upupdateAccountName update ERROR ", error);
    });
};

export const updateUserProjectCount = (project: string, count: number) => {
  const a = auth().currentUser;
  if (a != null) {
    const docRef1 = firestore().collection("users").doc(auth().currentUser.uid);

    docRef1.set(
      {
        postCount: {
          [project]: count,
        },
      },
      { merge: true },
    );
  }
};

export const updateAccountPhotoURL = (photoURL: string) => {
  const docRef1 = firestore().collection("users").doc(auth().currentUser.uid);

  const user = auth().currentUser;

  user
    .updateProfile({
      photoURL: photoURL,
    })
    .then(() => {
      docRef1.set(
        {
          photoURL: photoURL,
          email: auth().currentUser.email,
          displayName: auth().currentUser.displayName,
        },
        { merge: true },
      );
    })
    .then(() => {})
    .catch((error) => {
      console.log("updateAccountPhotoURL update ERROR ", error);
    });
};

export async function getUsers(callback: usersRead) {
  const users: IUser[] = [];

  const q = firestore().collection("users").orderBy("displayName", "asc");

  const usersSnapshot = await q.get();

  usersSnapshot.forEach((doc) => {
    users.push({
      key: doc.id,
      uid: doc.id,
      displayName: doc.data().displayName,
      email: doc.data().email,
      photoURL: doc.data().photoURL,
    });
  });

  callback(users);
}

export async function getUserProjectCount(callback: userProjectCountRead) {
  let user: IUser;

  firestore()
    .collection("users")
    .doc(auth().currentUser.uid)
    .get()
    .then((doc) => {
      user = {
        key: doc.id,
        uid: doc.id,
        displayName: doc.data().displayName,
        email: doc.data().email,
        photoURL: doc.data().photoURL,
        postCount: doc.data().postCount,
      };
      console.log("getUserProjectCount: ", user);

      callback(user);
    });
}
