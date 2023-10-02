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

  const docRef = doc(db, "users", auth().currentUser.uid);

  updateProfile(auth().currentUser, {
    displayName: displayName,
  })
    .then(() => {
      setDoc(
        docRef,
        {
          displayName: displayName,
          email: auth().currentUser.email,
          photoURL: auth().currentUser.photoURL,
        },
        { merge: true },
      );
    })
    .catch((error) => {
      // An error occurred
      // ...
      console.log("user update ERROR updated", error);
    });
};

export const updateAccountPhotoURL = (photoURL: string) => {
  //const { sharedData, updateSharedData } = useContext(AuthContext);
  console.log("updateAccountPhotoURL: FBJS");

  const docRef = doc(db, "users", auth().currentUser.uid);

  updateProfile(auth().currentUser, {
    photoURL: photoURL,
  })
    .then(() => {
      setDoc(
        docRef,
        {
          photoURL: photoURL,
          email: auth().currentUser.email,
          displayName: auth().currentUser.displayName,
        },
        { merge: true },
      );
    })
    .then(() => {
      //callback(project.key);
      console.log("its done-  account update:", photoURL);
    })
    .catch((error) => {
      // An error occurred
      // ...
      console.log("user update ERROR updated", error);
    });
};

export async function getUsers(callback: usersRead) {
  // const q = query(collection(db, "users"), orderBy("displayName", "asc"));

  console.log("getUsers: FBNATIVE");
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

  // const unsubscribe = q.onSnapshot((querySnapshot) => {
  //   console.log("AAA");
  //   const users: IUser[] = [];
  //   console.log("GGG");
  //   querySnapshot.forEach((doc) => {
  //     console.log("FFF");
  //     users.push({
  //       key: doc.id,
  //       displayName: doc.data().displayName,
  //       email: doc.data().email,
  //       photoURL: doc.data().photoURL,
  //     });
  //   });
  //   callback(users);
  // });

  //return () => unsubscribe;
}
