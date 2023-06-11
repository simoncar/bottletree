import { db } from "./firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

interface IProject {
	//key: string;
	title: string;
}

type projectsRead = (projects: IProject[]) => void;

export async function getProjects(callback: projectsRead) {
	//const q = query(collection(db, "projects"), where("state", "==", "CA"));
	const q = query(collection(db, "projects"));

	const unsubscribe = onSnapshot(q, (querySnapshot) => {
		const projects: IProject[] = [];
		querySnapshot.forEach((doc) => {
			projects.push(doc.data().title);
		});
		console.log("Current Projects: ", projects.join(", "));
		callback(projects);
	});

	return () => unsubscribe();
}

// export function isDomainAdmin(currentUid: string, adminArray: string[]) {
// 	if (Array.isArray(adminArray)) {
// 		if (adminArray.includes(currentUid)) return true;
// 		else return false;
// 	}
// }

// export async function isDomainAdminServer(currentUid: string, domain: string) {
// 	return new Promise((resolve, reject) => {
// 		firebase
// 			.firestore()
// 			.collection("domains")
// 			.where("node", "==", domain)
// 			.get()
// 			.then(function (snapshot) {
// 				snapshot.forEach(function (doc) {
// 					const x = isDomainAdmin(currentUid, doc.data().admins);
// 					resolve(x);
// 				});
// 			})
// 			.catch((error) => {
// 				reject(Error("isDomainAdminServer broke " + error));
// 			});
// 	});
// }
