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

const dbm = getFirestore();

console.log("__DEV__: ", __DEV__);

if (!Device.isDevice) {
  //   console.log("Connecting to Firebase Emulator");
  //   db.useEmulator("127.0.0.1", 8080);
  //   firestore().useEmulator("localhost", 8080);
  //   auth().useEmulator("http://localhost:9099");
  //   storage().useEmulator("127.0.0.1", 9199);
}

const uploadBytes = null;
const auth = getAuth();

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
