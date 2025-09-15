import firebase from "@react-native-firebase/app";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  signInAnonymously,
  sendPasswordResetEmail,
  signOut,
  connectAuthEmulator,
} from "@react-native-firebase/auth";
import firestore, {
  getFirestore,
  connectFirestoreEmulator,
  clearIndexedDbPersistence,
  arrayRemove,
  arrayUnion,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  addDoc,
  onSnapshot,
  orderBy,
  FirestoreError,
  runTransaction,
  writeBatch,
  Timestamp,
  FieldValue,
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import * as Device from "expo-device";
import {
  getStorage,
  connectStorageEmulator,
} from "@react-native-firebase/storage";

const dbm = getFirestore();
const uploadBytes = null;
const auth = getAuth();

console.log("__DEV__: ", __DEV__);

if (!Device.isDevice) {
  clearIndexedDbPersistence(dbm);
  //   console.log("Connecting to Firebase Emulator");
  //   // Firestore modular API
  //   connectFirestoreEmulator(dbm, "127.0.0.1", 8080);
  //   // Auth modular API
  //   connectAuthEmulator(auth, "http://localhost:9099");
  //   // Storage modular API
  //   const storage = getStorage();
  //   connectStorageEmulator(storage, "127.0.0.1", 9199);
}

export {
  auth,
  createUserWithEmailAndPassword,
  signInAnonymously,
  dbm,
  fetchSignInMethodsForEmail,
  firebase,
  firestore,
  signInWithEmailAndPassword,
  updateProfile,
  uploadBytes,
  sendPasswordResetEmail,
  signOut,
  arrayRemove,
  arrayUnion,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  addDoc,
  onSnapshot,
  orderBy,
  FirestoreError,
  runTransaction,
  writeBatch,
  Timestamp,
  FieldValue,
  FirebaseFirestoreTypes,
};
