jest.mock("@react-native-firebase/app", () => ({
  // Mocked return of the default export
  default: jest.fn(),
  // Mocked return of a named export
  someNamedExport: jest.fn(),
}));

jest.mock("@react-native-firebase/auth", () => {
  return () => ({
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve()),
    signOut: jest.fn(() => Promise.resolve()),
    // Add other methods as needed
  });
});

jest.mock("@react-native-firebase/firestore", () => {
  return () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(() => Promise.resolve()),
        get: jest.fn(() => Promise.resolve()),
        update: jest.fn(() => Promise.resolve()),
        delete: jest.fn(() => Promise.resolve()),
      })),
      get: jest.fn(() => Promise.resolve()),
      where: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve()),
      })),
    })),
  });
});

jest.mock("@react-native-firebase/storage", () => {
  return () => ({
    ref: jest.fn(() => ({
      putFile: jest.fn(() => Promise.resolve()),
      getDownloadURL: jest.fn(() => Promise.resolve("mockedUrl")),
    })),
  });
});

import { fbConfig } from "../env";
import * as Device from "expo-device";
import "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

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

const db = firestore();

firestore()
  .settings({
    persistence: true,
  })
  .then(() => {
    if (!Device.isDevice) {
      console.log("Connecting to Firebase Emulator");
      db.useEmulator("127.0.0.1", 8080);
      auth().useEmulator("http://localhost:9099");
      storage().useEmulator("127.0.0.1", 9199);
    }
  });

export { db, storage, auth, firestore };
