import { auth, firestore } from "./firebase";
import { IPushToken, IUser } from "./types";
import * as Notifications from "expo-notifications";

// ExponentPushToken[z-50OyGeRPth6nxZSWk_A4]

export function setToken(
  token: IPushToken,
  callback: { (id: string): void; (arg0: string): void },
) {
  try {
    console.log("setToken FBJS");

    const docRef = firestore().collection("tokens").doc(token.key);

    docRef
      .set(
        {
          pushToken: token.pushToken,
          uid: auth().currentUser?.uid,
          displayName: auth().currentUser?.displayName,
          timestamp: firestore.Timestamp.now(),
        },
        { merge: true },
      )
      .then((docRef) => {
        callback(token.key);
      });
  } catch (e) {
    console.error("Error adding token: ", e);
  }

  return;
}

export async function getToken() {
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}
