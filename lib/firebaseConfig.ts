import { fbConfig } from "../env";

import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, uploadBytes, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
	apiKey: `${fbConfig.apiKey}`,
	authDomain: `${fbConfig.authDomain}`,
	projectId: `${fbConfig.projectId}`,
	storageBucket: `${fbConfig.storageBucket}`,
	messagingSenderId: `${fbConfig.messagingSenderId}`,
	appId: `${fbConfig.appId}`
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage(app);

connectFirestoreEmulator(db, "localhost", 8080);

if (location.hostname === "localhost") {
	// Point to the Storage emulator running on localhost.
	connectStorageEmulator(storage, "127.0.0.1", 9199);
}

//console.log("connectFirestoreEmulator");

export { db, storage };
