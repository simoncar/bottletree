import firebase, { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  updateProfile,
} from "firebase/auth";
import {
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
  getFirestore,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

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

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const dbm = getFirestore(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const uploadBytes = null;

export {
  auth,
  dbm,
  firebase,
  firestore,
  storage,
  uploadBytes,
  updateProfile,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
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
