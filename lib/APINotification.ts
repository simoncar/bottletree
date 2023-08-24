import {
  addDoc,
  doc,
  updateDoc,
  collection,
  onSnapshot,
  setDoc,
  Timestamp,
  getDocs,
  documentId,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { IPushToken, IUser } from "./types";
import * as Notifications from "expo-notifications";

// ExponentPushToken[z-50OyGeRPth6nxZSWk_A4]

export function setToken(
  token: IPushToken,
  callback: { (id: string): void; (arg0: string): void },
) {
  try {
    const docRef = doc(db, "tokens", token.key);

    console.log(
      "setToken",
      token.key,
      token.pushToken,
      auth.currentUser?.uid,
      auth.currentUser?.displayName,
    );

    setDoc(
      docRef,
      {
        pushToken: token.pushToken,
        uid: auth.currentUser?.uid,
        displayName: auth.currentUser?.displayName,
        timestamp: Timestamp.now(),
      },
      { merge: true },
    ).then((docRef) => {
      callback(token.key);
    });
  } catch (e) {
    console.error("Error adding token: ", e);
  }

  return;
}

export async function getToken() {
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("UUUUUU:", token);
  return token;
}
