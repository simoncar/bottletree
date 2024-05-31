import firebase from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

const db = firestore();

console.log("__DEV__: ", __DEV__);

// if (!Device.isDevice) {
//   console.log("Connecting to Firebase Emulator");
//   db.useEmulator("127.0.0.1", 8080);
//   firestore().useEmulator("localhost", 8080);
//   auth().useEmulator("http://localhost:9099");
//   storage().useEmulator("127.0.0.1", 9199);
// }

export { firebase, db, storage, auth, firestore };
