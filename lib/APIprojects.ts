import {
    addDoc,
    doc,
    updateDoc,
    collection,
    onSnapshot,
    query,
    Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { IProject, IUser } from "./types";

type projectsRead = (projects: IProject[]) => void;

export async function getProjects(callback: projectsRead) {
    const q = query(collection(db, "projects"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const projects: IProject[] = [];
        querySnapshot.forEach((doc) => {
            projects.push({
                key: doc.id,
                title: doc.data().title,
                icon: doc.data().icon,
            });
        });
        callback(projects);
    });

    return () => unsubscribe();
}

export async function getProjectUsers(
    projectId: string,
    callback: projectUsersRead,
) {
    console.log("getProjectUsers", projectId);

    const q = query(collection(db, "projects", projectId, "users"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        console.log("getProjectUsers 222");
        const projectUsers: IUser[] = [];
        querySnapshot.forEach((doc) => {
            projectUsers.push({
                uid: doc.id,
                photoURL: doc.data().avatar,
                displayName: doc.data().name,
                email: doc.data().email,
            });
        });
        console.log("projectUsers", projectUsers);

        callback(projectUsers);
    });

    return () => unsubscribe();
}

export function updateProject(project: IProject, callback: saveDone) {
    const ref = doc(db, "projects", project.key);
    updateDoc(ref, {
        title: project.title,
    }).then(() => {
        callback(project.key);
    });
}

export function addProject(project: IProject, callback: saveDone) {
    try {
        const docRef = addDoc(collection(db, "projects"), {
            title: project.title,
            icon: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fhouse.png?alt=media&token=d49c7085-03f3-4115-ab17-21683d33ff07",
            timestamp: Timestamp.now(),
        }).then((docRef) => {
            console.log("Project written with ID: ", docRef.id);
            callback(docRef.id);
        });
    } catch (e) {
        console.error("Error adding project: ", e);
    }

    return;
}
