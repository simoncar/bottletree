import firebase from "@react-native-firebase/app";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from "@react-native-firebase/auth";
import firestore, { getFirestore } from "@react-native-firebase/firestore";
import * as Device from "expo-device";
import { connectFirestoreEmulator } from "@react-native-firebase/firestore";
import { connectAuthEmulator } from "@react-native-firebase/auth";
import {
  getStorage,
  connectStorageEmulator,
} from "@react-native-firebase/storage";

const dbm = getFirestore();
const uploadBytes = null;
const auth = getAuth();

console.log("__DEV__: ", __DEV__);

if (!Device.isDevice) {
  console.log("Connecting to Firebase Emulator");
  // Firestore modular API
  connectFirestoreEmulator(dbm, "127.0.0.1", 8080);

  // Auth modular API
  connectAuthEmulator(auth, "http://localhost:9099");

  // Storage modular API
  const storage = getStorage();
  connectStorageEmulator(storage, "127.0.0.1", 9199);
}

export {
  auth,
  createUserWithEmailAndPassword,
  dbm,
  fetchSignInMethodsForEmail,
  firebase,
  firestore,
  signInWithEmailAndPassword,
  updateProfile,
  uploadBytes,
};
