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
import firestore from "@react-native-firebase/firestore";
import { IProject, IUser } from "./types";

type projectsRead = (projects: IProject[]) => void;
const stockHouseIcon =
  "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fhouse.png?alt=media&token=d49c7085-03f3-4115-ab17-21683d33ff07";

export async function getProjects(callback: projectsRead) {
  console.log("getProjects: FBNATIVE");

  //const q = query(collection(db, "projects"), orderBy("archived", "asc"));
  const q = firestore().collection("projects").orderBy("archived", "asc");

  const unsubscribe = q.onSnapshot((querySnapshot) => {
    const projects: IProject[] = [];
    querySnapshot.forEach((doc) => {
      console.log("getProjects onSnapshot: FBNATIVE");
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
  console.log("getProjectUsers: FBNATIVE", projectId);

  //firestore().collection("todos");
  //const q1 = query(collection(db, "projects", projectId, "users"));
  const q1 = firestore()
    .collection("projects")
    .doc(projectId)
    .collection("users");

  const idSnapshot = await q1.get();
  const idList: string[] = [];
  idSnapshot.forEach((doc) => {
    idList.push(doc.id);
  });

  const userList: IUser[] = [];

  if (idList.length > 0) {
    // const q2 = query(
    //   collection(db, "users"),
    //   where(documentId(), "in", idList),
    // );

    const q2 = firestore()
      .collection("users")
      .where(firestore.FieldPath.documentId(), "in", idList);

    const usersSnapshot = await q2.get();

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

  console.log("updateProject FBJS:", project);

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
    console.log("addProject FBJS: ", project.title);

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
    console.log(
      "addProjectUser: FBNATIVE ",
      projectId,
      user.key,
      user.displayName,
    );

    //const docRef = doc(db, "projects", projectId, "users", user.key);
    const docRef = firestore()
      .collection("projects")
      .doc(projectId)
      .collection("users")
      .doc(user.key);

    docRef
      .set(
        {
          uid: user.key,
          displayName: user.displayName,
          timestamp: Timestamp.now(),
        },
        { merge: true },
      )
      .then((docRef) => {
        callback(user.key);
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
    console.log(
      "deleteProjectUser: FBJS",
      projectId,
      user.uid,
      user.displayName,
    );

    const docRef = doc(db, "projects", projectId, "users", user.uid);

    deleteDoc(docRef).then(() => {
      callback(user.uid);
    });
  } catch (e) {
    console.error("Error deleting user from project: ", e);
  }

  return;
}
