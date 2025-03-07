import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

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

const app = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth;
const db = firebase.firestore();
const firestore = firebase.firestore;
const storage = firebase.storage().ref();
const uploadBytes = null;

export { firebase, db, storage, auth, firestore, uploadBytes };
