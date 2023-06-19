import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export const demoData = async () => {
	//console.log("Skip demo data");
};

export const demoData2 = async () => {
	try {
		const projectRef1 = await addDoc(collection(db, "projects"), {
			title: "(Local) 106 Jolimont",
			icon: "https://"
		});

		console.log("Document written with ID: ", projectRef1.id);

		const postRef1 = await addDoc(collection(db, "projects", projectRef1.id, "posts"), {
			author: "John Doe",
			avatar: "https://",
			timestamp: Timestamp.now(),
			images: ["http://127.0.0.1:9199/v0/b/builder-403d5.appspot.com/o/rovira.jpg?alt=media&token=abceec3f-7a1c-4208-8233-59955e407d9b"]
		});

		console.log("Document written with ID: ", postRef1.id);

		const projectRef2 = await addDoc(collection(db, "projects"), {
			title: "(Local) Placa Rovira",
			icon: "https://"
		});

		console.log("Document written with ID: ", projectRef2.id);

		const postRef2 = await addDoc(collection(db, "projects", projectRef2.id, "posts"), {
			author: "John Doe",
			avatar: "https://",
			timestamp: Timestamp.now(),
			images: ["http://127.0.0.1:9199/v0/b/builder-403d5.appspot.com/o/rovira.jpg?alt=media&token=abceec3f-7a1c-4208-8233-59955e407d9b"]
		});

		console.log("Document written with ID: ", postRef2.id);
	} catch (e) {
		console.error("Error adding document: ", e);
	}
};
