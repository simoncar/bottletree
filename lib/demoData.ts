import { db } from "./firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export const demoData = async () => {
	try {
		const projectRef = await addDoc(collection(db, "projects"), {
			title: "Local 106 Jolimont",
			icon: "https://"
		});

		console.log("Document written with ID: ", projectRef.id);

		const postRef = await addDoc(collection(db, "projects", projectRef.id, "posts"), {
			author: "John Doe",
			avatar: "https://",
			timestamp: Timestamp.now(),
			images: ["http://127.0.0.1:9199/v0/b/builder-403d5.appspot.com/o/rovira.jpg?alt=media&token=abceec3f-7a1c-4208-8233-59955e407d9b"]
		});

		console.log("Document written with ID: ", postRef.id);
	} catch (e) {
		console.error("Error adding document: ", e);
	}
};
