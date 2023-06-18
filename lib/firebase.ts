import { fbConfig } from "../env";
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

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

// if (location.hostname === "localhost") {
// 	connectFirestoreEmulator(db, "localhost", 8080);
// 	connectStorageEmulator(storage, "127.0.0.1", 9199);
// }

export { db, storage };
