import { database } from "./firebaseConfig";

// POSTS
// author
// content
// id
// likes
// nLikes

// NOTIFICATIONS
// image
// message
// receiver ID

import { collection, addDoc } from "firebase/firestore";

export const demoData = async () => {
	console.log("demoData");

	try {
		const docRef = await addDoc(collection(database, "users"), {
			first: "Ada",
			last: "Lovelace",
			born: 1815
		});
		console.log("Document written with ID: ", docRef.id);
	} catch (e) {
		console.error("Error adding document: ", e);
	}
};
