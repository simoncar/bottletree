import { fbConfig } from "../env";
// import * as Device from "expo-device";
// import auth from "firebase/auth";
// import firestore from "firebase/firestore";
import storage, { uploadBytes } from "firebase/storage";
// import firebase from "firebase/compat/app";

// import { initializeApp } from "firebase/app";

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

//

// export { firebase, db, storage, auth, firestore };
const auth = firebase.auth;
const db = firebase.firestore();
//const storage = firebase.storage();
const firestore = firebase.firestore;

db.useEmulator("127.0.0.1", 8080);
auth().useEmulator("http://localhost:9099");
//storage().useEmulator("127.0.0.1", 9199);
//
export { firebase, db, storage, auth, firestore, uploadBytes };

// export const firebaseErrors: Record<string, string> = {
//   "Firebase: Error (auth/email-already-in-use).":
//     "This email is already is use.",
//   "Firebase: Error (auth/popup-closed-by-user).":
//     "Process got canceled by user.",
//   "Firebase: Error (auth/user-not-found).": "User not found.",
//   "Firebase: Error (auth/wrong-password).": "Wrong email or password.",
//   "Firebase: Error (auth/network-request-failed).":
//     "Failed to send the request. Check your connection.",
// };

// const db = initializeApp(firebaseConfig);

// // const db = firestore(app);

// // firestore()
// //   .settings({
// //     persistence: true,
// //   })
// //   .then(() => {
// //     if (!Device.isDevice) {
// //       console.log("Connecting to Firebase Emulator");
// //       db.useEmulator("127.0.0.1", 8080);
// //       auth().useEmulator("http://localhost:9099");
// //       storage().useEmulator("127.0.0.1", 9199);
// //     }
// //   });

// export { firebase, db, storage, auth, firestore };
