import { fbConfig } from "../env";
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import * as Device from "expo-device";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import {
  initializeAuth,
  getReactNativePersistence,
  connectAuthEmulator,
} from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

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
  apiKey: `${fbConfig.apiKey}`,
  authDomain: `${fbConfig.authDomain}`,
  projectId: `${fbConfig.projectId}`,
  storageBucket: `${fbConfig.storageBucket}`,
  messagingSenderId: `${fbConfig.messagingSenderId}`,
  appId: `${fbConfig.appId}`,
};

const app = initializeApp(firebaseConfig);
const auth_js = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore();
const storage = getStorage(app);

if (!Device.isDevice) {
  console.log("Connecting to Firebase Emulator");
  firestore().useEmulator("127.0.0.1", 8080);
  auth().useEmulator("http://localhost:9099");

  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
  connectAuthEmulator(auth_js, "http://localhost:9099/auth");
}

//firestore().disableNetwork();

export { db, storage, auth_js, auth };
