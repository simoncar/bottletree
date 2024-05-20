import { db, firestore } from "./firebase";
import { IProject, IUser } from "./types";

type projectsRead = (projects: IProject[]) => void;
const stockHouseIcon =
  "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fhouse.png?alt=media&token=d49c7085-03f3-4115-ab17-21683d33ff07";

export async function getProject(
  project: string,
  callback: { (project: IProject): void; (arg0: IProject): void },
) {
  if (!project) {
    console.log("No project provided");
    return;
  }
  console.log("getProject:", project);

  const q = db.collection("projects").doc(project);

  const unsubscribe = q.onSnapshot((doc) => {
    if (!doc.exists) {
      console.log("No such project:", project);
      return;
    }
    const returnProject: IProject = {
      project: doc.id,
      key: doc.id,
      title: doc.data().title || "Untitled",
      icon: doc.data().icon,
      archived: doc.data().archived,
      postCount: doc.data().postCount,
    };

    callback(returnProject);
  });

  return () => unsubscribe();
}

export async function getProjects(uid: string, callback: projectsRead) {
  const projectList: string[] = ["X"];
  const projects: IProject[] = [];
  const projectsArchived: IProject[] = [];

  const query = db.collectionGroup("accessList").where("uid", "==", uid);

  await query.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      projectList.indexOf(doc.data().projectId) === -1
        ? projectList.push(doc.data().projectId)
        : console.log("This item already exists");
    });
  });

  const q = db.collection("projects"); //.orderBy("timestamp", "desc");

  const projectsSnapshot = await q.get();

  projectsSnapshot.forEach((doc) => {
    if (projectList.includes(doc.id)) {
      if (!doc.data().archived) {
        projects.push({
          project: doc.id,
          key: doc.id,
          title: doc.data().title || "Untitled",
          icon: doc.data().icon,
          archived: false,
          postCount: doc.data().postCount,
        });
      } else {
        projectsArchived.push({
          project: doc.id,
          key: doc.id,
          title: doc.data().title || "Untitled",
          icon: doc.data().icon,
          archived: true,
          postCount: doc.data().postCount,
        });
      }
    }
  });

  callback([...projects, ...projectsArchived]);

  return;
}

export async function getAllProjects(callback: projectsRead) {
  const projects: IProject[] = [];
  const projectsArchived: IProject[] = [];

  const q = db.collection("projects"); //.orderBy("timestamp", "desc");

  const projectsSnapshot = await q.get();

  projectsSnapshot.forEach((doc) => {
    if (!doc.data().archived) {
      projects.push({
        project: doc.id,
        key: doc.id,
        title: doc.data().title || "Untitled",
        icon: doc.data().icon,
        archived: false,
        postCount: doc.data().postCount,
      });
    } else {
      projectsArchived.push({
        project: doc.id,
        key: doc.id,
        title: doc.data().title || "Untitled",
        icon: doc.data().icon,
        archived: true,
        postCount: doc.data().postCount,
      });
    }
  });

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
    console.log("Adding project: ", projectId, project, user);

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

//function to retrieve all projects from firebase and then add the user to the accessList for each project
export function addProjectUserAll(user: IUser, callback: saveDoneAll) {
  console.log("Adding user to all projects: ", user);

  getAllProjects((projects) => {
    projects.forEach((project) => {
      console.log("Adding user to project: ", project.key, project);
      addProjectUser(project.key, user);
    });
    callback();
  });
}


export function addProjectUser(
  projectId: string,
  user: IUser,
  callback?: { (id: string): void; (arg0: string): void },
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

const generateProjectReference = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars.charAt(randomIndex);
  }
  return code;
};
