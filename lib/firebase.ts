import { fbConfig } from "../env";
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { initializeAuth, getReactNativePersistence, connectAuthEmulator } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
	apiKey: `${fbConfig.apiKey}`,
	authDomain: `${fbConfig.authDomain}`,
	projectId: `${fbConfig.projectId}`,
	storageBucket: `${fbConfig.storageBucket}`,
	messagingSenderId: `${fbConfig.messagingSenderId}`,
	appId: `${fbConfig.appId}`
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore();
const storage = getStorage(app);

//connectFirestoreEmulator(db, "localhost", 8080);
//connectStorageEmulator(storage, "127.0.0.1", 9199);
//connectAuthEmulator(auth, "http://localhost:9099/auth");

export { db, storage, auth };
