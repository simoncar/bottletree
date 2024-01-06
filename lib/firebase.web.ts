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
  apiKey: `${fbConfig.apiKey}`,
  authDomain: `${fbConfig.authDomain}`,
  projectId: `${fbConfig.projectId}`,
  storageBucket: `${fbConfig.storageBucket}`,
  messagingSenderId: `${fbConfig.messagingSenderId}`,
  appId: `${fbConfig.appId}`,
};

firebase.apps.length === 0 && firebase.initializeApp(firebaseConfig);

//

// export { firebase, db, storage, auth, firestore };
const auth = firebase.auth;
const db = firebase.firestore();
//const storage = firebase.storage();
const firestore = firebase.firestore;

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
