globalThis.RNFB_MODULAR_DEPRECATION_STRICT_MODE === true;
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

import firebase from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import * as Device from "expo-device";

const db = firestore();

console.log("__DEV__: ", __DEV__);

if (!Device.isDevice) {
  //   console.log("Connecting to Firebase Emulator");
  //   db.useEmulator("127.0.0.1", 8080);
  //   firestore().useEmulator("localhost", 8080);
  //   auth().useEmulator("http://localhost:9099");
  //   storage().useEmulator("127.0.0.1", 9199);
}

const uploadBytes = null;

export { auth, db, firebase, firestore, storage, uploadBytes };
