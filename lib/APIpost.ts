import { db } from "./firebase";
import { collection, query, addDoc, onSnapshot, Timestamp, orderBy } from "firebase/firestore";
import { IPost } from "./types";

export function savePost(post: IPost, callback: saveDone) {
	try {
		const docRef = addDoc(collection(db, "projects", post.projectId, "posts"), {
			author: "Ada",
			avatar:
				"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FScreenshot%202023-05-30%20at%202.47.44%20PM.png?alt=media&token=30888878-15e6-4395-b3d4-53ae17758e33&_gl=1*pyfxsn*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ1MDg3Ni44LjEuMTY4NTQ1MDkxMS4wLjAuMA..",
			images: [post.images[0]],
			timestamp: Timestamp.now()
		}).then((docRef) => {
			console.log("Document written with ID: ", docRef.id);
			callback(docRef.id);
		});
	} catch (e) {
		console.error("Error adding document: ", e);
	}

	return;
}

export async function getPosts(projectId, callback: postsRead) {
	if (undefined === projectId) {
		projectId = "void";
	}

	const q = query(collection(db, "projects", projectId, "posts"), orderBy("timestamp", "desc"));

	const unsubscribe = onSnapshot(q, (querySnapshot) => {
		const posts: IPost[] = [];
		querySnapshot.forEach((doc) => {
			posts.push({
				key: doc.id,
				projectId: projectId,
				author: doc.data().author,
				images: doc.data().images,
				timestamp: doc.data().timestamp
			});
		});
		callback(posts);
	});

	return () => unsubscribe();
}
