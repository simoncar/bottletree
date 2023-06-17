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
