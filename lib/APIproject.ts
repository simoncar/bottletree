import { db, firestore } from "./firebase";
import { IProject, IUser } from "./types";

type projectsRead = (projects: IProject[]) => void;
const stockHouseIcon =
  "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fhouse.png?alt=media&token=d49c7085-03f3-4115-ab17-21683d33ff07";

// create an export function that loads a single

export async function getProject(
  projectId: string,
  callback: { (project: IProject): void; (arg0: IProject): void },
) {
  const q = db.collection("projects").doc(projectId);

  const unsubscribe = q.onSnapshot((doc) => {
    const project: IProject = {
      key: doc.id,
      title: doc.data().title || "Untitled",
      icon: doc.data().icon,
      archived: doc.data().archived,
      postCount: doc.data().postCount,
    };

    callback(project);
  });

  return () => unsubscribe();
}

export async function getProjects(uid: string, callback: projectsRead) {
  const projectList: string[] = ["X"];
  const projects: IProject[] = [];
  const projectsArchived: IProject[] = [];

  const accessRef = db.collectionGroup("accessList");
  let query = accessRef;

  if (uid != "") {
    query = accessRef.where("uid", "==", uid);
  }

  await query.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      projectList.indexOf(doc.data().projectId) === -1
        ? projectList.push(doc.data().projectId)
        : console.log("This item already exists");
      //
    });
  });

  const q = db.collection("projects").orderBy("timestamp", "desc");

  const projectsSnapshot = await q.get();

  projectsSnapshot.forEach((doc) => {
    if (projectList.includes(doc.id)) {
      if (!doc.data().archived) {
        projects.push({
          key: doc.id,
          title: doc.data().title || "Untitled",
          icon: doc.data().icon,
          archived: doc.data().archived,
          postCount: doc.data().postCount,
        });
      } else {
        projectsArchived.push({
          key: doc.id,
          title: doc.data().title || "Untitled",
          icon: doc.data().icon,
          archived: doc.data().archived,
          postCount: doc.data().postCount,
        });
      }
    }
  });

  console.log("projects: ", projects);
  callback([...projects, ...projectsArchived]);

  return;
}

export async function getProjectUsers(
  projectId: string,
  callback: { (projectUsersDB: any): void; (arg0: IUser[]): void },
) {
  const q1 = db.collection("projects").doc(projectId).collection("accessList");

  const idSnapshot = await q1.get();
  const idList: string[] = [];
  idSnapshot.forEach((doc) => {
    idList.push(doc.id);
  });

  const userList: IUser[] = [];
  console.log("idList: ", idList);

  if (idList.length > 0) {
    const q2 = db.collection("users");

    const usersSnapshot = await q2.get();

    usersSnapshot.forEach((doc) => {
      if (idList.includes(doc.id)) {
        userList.push({
          uid: doc.id,
          displayName: doc.data().displayName,
          email: doc.data().email,
          photoURL: doc.data().photoURL,
        });
      }
    });
  }

  callback(userList);
}

export function updateProject(project: IProject, callback: saveDone) {
  const ref = db.collection("projects").doc(project.key);

  ref
    .update({
      title: project.title,
      icon: project?.icon ?? stockHouseIcon,
      archived: project?.archived ?? false,
    })
    .then(() => {
      callback(project.key);
    });
}

export function addProject(
  project: IProject,
  user: IUser,
  callback: { (id: string): void; (arg0: string): void },
) {
  try {
    const projectId = generateProjectReference();

    //TODO: check the project refernce is not already in use (unlikely)

    db.collection("projects")
      .doc(projectId)
      .set({
        title: project.title,
        icon: stockHouseIcon,
        timestamp: firestore.Timestamp.now(),
        archived: false,
        postCount: 0,
      })
      .then(() => {
        console.log("Project written with ID: ", projectId);
        callback(projectId);
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
  console.log("Adding user to project: ", projectId, user);

  try {
    db.collection("projects")
      .doc(projectId)
      .collection("accessList")
      .doc(user.uid)
      .set(
        {
          uid: user.uid,
          displayName: user.displayName,
          timestamp: firestore.Timestamp.now(),
          projectId: projectId,
        },
        { merge: true },
      )
      .then((docRef) => {
        if (callback) {
          callback(projectId);
        } else {
          console.log("Callback not provided.");
        }
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
    const docRef = db
      .collection("projects")
      .doc(projectId)
      .collection("accessList")
      .doc(user.uid);

    docRef.delete().then(() => {
      callback(user.uid);
    });
  } catch (e) {
    console.error("Error deleting user from project: ", e);
  }

  return;
}

const generateProjectReference = (): string => {};

console.log(generateProjectReference());
