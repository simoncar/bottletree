import * as Device from "expo-device";
import firebase from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

export const firebaseErrors: Record<string, string> = {
  "Firebase: Error (auth/email-already-in-use).":
    "This email is already is use.",
  "Firebase: Error (auth/popup-closed-by-user).":
    "Process got canceled by user.",
  "Firebase: Error (auth/user-not-found).": "User not found.",
  "Firebase: Error (auth/wrong-password).": "Wrong email or password.",
  "Firebase: Error (auth/network-request-failed).":
    "Failed to send the request. Check your connection.",
};

const db = firestore();

console.log("__DEV__: ", __DEV__);

if (!Device.isDevice) {
  console.log("Connecting to Firebase Emulator");
  db.useEmulator("127.0.0.1", 8080);
  firestore().useEmulator("localhost", 8080);
  auth().useEmulator("http://localhost:9099");
  storage().useEmulator("127.0.0.1", 9199);
}

export { firebase, db, storage, auth, firestore };
