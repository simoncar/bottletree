import { fbConfig } from "../env";

import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
	apiKey: `${fbConfig.apiKey}`,
	authDomain: `${fbConfig.authDomain}`,
	projectId: `${fbConfig.projectId}`,
	storageBucket: `${fbConfig.storageBucket}`,
	messagingSenderId: `${fbConfig.messagingSenderId}`,
	appId: `${fbConfig.appId}`
};

console.log("firebaseConfig", firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore();

connectFirestoreEmulator(db, "localhost", 8080);

//console.log("connectFirestoreEmulator");

export { db };
