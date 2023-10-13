import { auth, firestore } from "./firebase";
import { IPushToken, IUser } from "./types";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export function setToken(
  token: IPushToken,
  callback: { (id: string): void; (arg0: string): void },
) {
  if (Device.isDevice) {
    try {
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
  }

  return;
}

export async function getToken() {
  if (Device.isDevice) {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  } else {
    return "";
  }
}
