import { fbConfig } from "../env";
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

const firebaseConfig = {
  apiKey: "AIzaSyA-u3kUGycFCQQC5S3r2p2nQAGPRhKiMpE",
  authDomain: "builder-403d5.firebaseapp.com",
  databaseURL: "https://builder-403d5-default-rtdb.firebaseio.com",
  projectId: "builder-403d5",
  storageBucket: "builder-403d5.appspot.com",
  messagingSenderId: "813298396785",
  appId: "1:813298396785:web:80b06b25db284086d175d0",
  measurementId: "G-37RWRJQHKX",
};

const db = firestore();

firestore()
  .settings({
    persistence: true,
  })
  .then(() => {
    if (!Device.isDevice) {
      console.log("Connecting to Firebase Emulator");
      db.useEmulator("127.0.0.1", 8080);
      auth().useEmulator("http://localhost:9099");
      storage().useEmulator("127.0.0.1", 9199);
    }
  });

export { firebase, db, storage, auth, firestore };
//export default firebase;
