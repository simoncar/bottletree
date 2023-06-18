import { db } from "./firebaseConfig";
import { collection, query,  onSnapshot } from "firebase/firestore";
import { IProject } from "./types";

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
		callback(projects);
	});

	return () => unsubscribe();
}
