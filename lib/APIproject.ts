import {
  addDoc,
  doc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
  getDocs,
  documentId,
  orderBy,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { IProject, IUser } from "./types";

type projectsRead = (projects: IProject[]) => void;
const stockHouseIcon =
  "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fhouse.png?alt=media&token=d49c7085-03f3-4115-ab17-21683d33ff07";

export async function getProjects(callback: projectsRead) {
  const q = query(collection(db, "projects"), orderBy("archived", "asc"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const projects: IProject[] = [];
    querySnapshot.forEach((doc) => {
      projects.push({
        key: doc.id,
        title: doc.data().title,
        icon: doc.data().icon,
        archived: doc.data().archived,
      });
    });
    callback(projects);
  });

  return () => unsubscribe;
}

export async function getProjectUsers(
  projectId: string,
  callback: { (projectUsersDB: any): void; (arg0: IUser[]): void },
) {
  const q1 = query(collection(db, "projects", projectId, "users"));

  const idSnapshot = await getDocs(q1);
  const idList: string[] = [];
  idSnapshot.forEach((doc) => {
    idList.push(doc.id);
  });

  const userList: IUser[] = [];

  if (idList.length > 0) {
    const q2 = query(
      collection(db, "users"),
      where(documentId(), "in", idList),
    );

    const usersSnapshot = await getDocs(q2);

    usersSnapshot.forEach((doc) => {
      userList.push({
        uid: doc.id,
        displayName: doc.data().displayName,
        email: doc.data().email,
        photoURL: doc.data().photoURL,
      });
    });
  }

  callback(userList);
}

export function updateProject(project: IProject, callback: saveDone) {
  const ref = doc(db, "projects", project.key);

  console.log("updateProject:", project);

  updateDoc(ref, {
    title: project.title,
    icon: project?.icon ?? stockHouseIcon,
    archived: project?.archived ?? false,
  }).then(() => {
    callback(project.key);
  });
}

export function addProject(
  project: IProject,
  callback: { (id: string): void; (arg0: string): void },
) {
  try {
    addDoc(collection(db, "projects"), {
      title: project.title,
      icon: stockHouseIcon,
      timestamp: Timestamp.now(),
      archived: false,
    }).then((docRef) => {
      console.log("Project written with ID: ", docRef.id);
      callback(docRef.id);
    });
  } catch (e) {
    console.error("Error adding project: ", e);
  }

  return;
}

export function addProjectUser(
  projectId: string,
  user: IUser,
  callback: { (id: string): void; (arg0: string): void },
) {
  try {
    console.log("addProjectUser: ", projectId, user.key, user.displayName);

    const docRef = doc(db, "projects", projectId, "users", user.key);

    setDoc(
      docRef,
      {
        uid: user.key,
        displayName: user.displayName,
        timestamp: Timestamp.now(),
      },
      { merge: true },
    ).then((docRef) => {
      callback(user.uid);
    });
  } catch (e) {
    console.error("Error adding user to project: ", e);
  }

  return;
}

export function deleteProjectUser(
  projectId: string,
  user: IUser,
  callback: { (id: string): void; (arg0: string): void },
) {
  try {
    console.log("deleteProjectUser: ", projectId, user.key, user.displayName);

    const docRef = doc(db, "projects", projectId, "users", user.key);

    deleteDoc(docRef).then(() => {
      callback(user.key);
    });
  } catch (e) {
    console.error("Error deleting user from project: ", e);
  }

  return;
}
