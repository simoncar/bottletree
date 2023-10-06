import { updateProfile } from "firebase/auth/react-native";
import { auth, db } from "../lib/firebase";
import {
  doc,
  setDoc,
  query,
  collection,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import firestore from "@react-native-firebase/firestore";

export const updateAccountName = (displayName: string) => {
  console.log("updateAccountName: FBJS");

  const docRef1 = firestore().collection("users").doc(auth().currentUser.uid);

  console.log("FBJS******* UPDATE REQUIRED auth:");

  const docRef2 = updateProfile(auth().currentUser, {
    displayName: displayName,
  })
    .then(() => {
      docRef1.set(
        {
          displayName: displayName,
          email: auth().currentUser.email,
          photoURL: auth().currentUser.photoURL,
        },
        { merge: true },
      );
    })
    .catch((error) => {
      console.log("upupdateAccountName update ERROR ", error);
    });
};

export const updateAccountPhotoURL = (photoURL: string) => {
  const docRef1 = firestore().collection("users").doc(auth().currentUser.uid);

  console.log("FBJS******* UPDATE REQUIRED auth:");

  updateProfile(auth().currentUser, {
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

  const q = firestore().collection("users");

  const usersSnapshot = await q.get();

  usersSnapshot.forEach((doc) => {
    users.push({
      key: doc.id,
      displayName: doc.data().displayName,
      email: doc.data().email,
      photoURL: doc.data().photoURL,
    });
  });

  callback(users);
}
