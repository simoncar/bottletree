import iconSet from "@expo/vector-icons/build/FontAwesome5";
import { db } from "./firebaseConfig";
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";

interface IProject {
	key: string;
	title: string;
	icon: string;
}

interface IPost {
	key: string;
	author: string;
	timestamp: any;
	images: string[];
}

type projectsRead = (projects: IProject[]) => void;

export async function getProjects(callback: projectsRead) {
	//const q = query(collection(db, "projects"), where("state", "==", "CA"));
	const q = query(collection(db, "projects"));

	const unsubscribe = onSnapshot(q, (querySnapshot) => {
		const projects: IProject[] = [];
		querySnapshot.forEach((doc) => {
			projects.push({
				key: doc.id,
				title: doc.data().title,
				icon: doc.data().icon
			});
		});
		console.log("Current Projects: ", projects.join(", "));
		callback(projects);
	});

	return () => unsubscribe();
}

export async function getPosts(projectId, callback: postsRead) {
	//const querySnapshot = await getDocs(collection(db, "cities", "SF", "landmarks"));
	//const q = query(collection(db, "projects", projectId, "posts"), where("state", "==", "CA"));
	const q = query(collection(db, "projects", projectId, "posts"));

	const unsubscribe = onSnapshot(q, (querySnapshot) => {
		const posts: IPost[] = [];
		querySnapshot.forEach((doc) => {
			posts.push({
				key: doc.id,
				author: doc.data().author,
				images: doc.data().images,
				timestamp: doc.data().timestamp
			});
		});
		console.log("Current Posts: ", posts.join(", "));
		callback(posts);
	});

	return () => unsubscribe();
}
