import { db, firestore } from "./firebase";
import { IProject, IUser } from "./types";
import { createUser } from "./APIuser";

type projectsRead = (projects: IProject[]) => void;
const stockHouseIcon =
  "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fhouse.png?alt=media&token=d49c7085-03f3-4115-ab17-21683d33ff07";

export async function getProject(
  project: string,
  callback: { (project: IProject): void; (arg0: IProject): void },
) {
  if (!project) {
    callback(null);
    return;
  }

  console.log("getProject DB CALL", project);

  const q = db.collection("projects").doc(project);

  const unsubscribe = q.onSnapshot((doc) => {
    if (!doc.exists) {
      console.log("No such project:", project);
      callback(null);
      return;
    }
    const returnProject: IProject = {
      project: doc.id,
      key: doc.id,
      title: doc.data().title || "Untitled",
      icon: doc.data().icon,
      archived: doc.data().archived,
      postCount: doc.data().postCount,
      private: doc.data().private || false,
    };

    callback(returnProject);
  });

  return () => unsubscribe();
}

export async function getProjects(
  uid: string,
  archived: boolean,
  callback: projectsRead,
) {
  const projectList: string[] = ["X"];
  const projects: IProject[] = [];
  const projectsArchived: IProject[] = [];

  if (!uid) {
    callback(null);
    return;
  }

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
          timestamp: doc.data().timestamp,
          private: doc.data().private || false,
        });
      } else {
        if (archived) {
          projectsArchived.push({
            project: doc.id,
            key: doc.id,
            title: doc.data().title || "Untitled",
            icon: doc.data().icon,
            archived: true,
            postCount: doc.data().postCount,
            timestamp: doc.data().timestamp,
            private: doc.data().private || false,
          });
        }
      }
    }
  });

  //if any project has a null timestamp, set it to '1/jan/1990'
  projects.forEach((project) => {
    if (!project.timestamp) {
      project.timestamp = new firestore.Timestamp(631152000, 0);
    }
  });

  //order the projectList by timestamp, with the most recent timestamps first
  projects.sort((a, b) => {
    return b.timestamp?.seconds - a.timestamp?.seconds;
  });

  projectsArchived.sort((a, b) => {
    return b.timestamp?.seconds - a.timestamp?.seconds;
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
        private: doc.data().private || false,
      });
    } else {
      projectsArchived.push({
        project: doc.id,
        key: doc.id,
        title: doc.data().title || "Untitled",
        icon: doc.data().icon,
        archived: true,
        postCount: doc.data().postCount,
        private: doc.data().private || false,
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
    idList.push(doc.data().uid);
  });

  const userList: IUser[] = [];

  if (idList.length > 0) {
    const q2 = db.collection("users");

    const usersSnapshot = await q2.get();

    usersSnapshot.forEach((doc) => {
      if (idList.includes(doc.id)) {
        if (!doc.data().anonymous) {
          userList.push({
            uid: doc.id,
            displayName: doc.data().displayName,
            email: doc.data().email,
            photoURL: doc.data().photoURL,
            project: projectId,
            anonymous: doc.data().anonymous ? true : false,
          });
        }
      }
    });
  }

  callback(userList);
}

export function updateProject(project: IProject, callback: any) {
  const ref = db.collection("projects").doc(project.key);

  ref
    .update({
      title: project.title,
      icon: project?.icon ?? stockHouseIcon,
      archived: project?.archived ?? false,
      private: project?.private || false,
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
        private: project?.private || false,
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
export function addProjectUserAll(user: IUser, callback: any) {
  getAllProjects((projects) => {
    projects.forEach((project) => {
      console.log("Adding user to project: ", project.key, project);
      addProjectUser(project.key, user);
    });
    callback();
  });
}

export function archiveAllProjects(callback: any) {
  const updatedDone = (projectKey) => {
    console.log("Projecct Arhived: ", projectKey);
  };

  getAllProjects((projects) => {
    projects.forEach((project) => {
      if (!project.postCount) {
        updateProject({ ...project, archived: true }, updatedDone);
      }
    });
    callback();
  });
}

export async function addProjectUser(
  projectId: string,
  user: IUser,
  callback?: { (id: string): void; (arg0: string): void },
) {
  console.log("Adding user to project (Before): ", projectId, user);

  user = await createUser(user);

  console.log("Adding user to project (After): ", projectId, user);

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
      .then(() => {
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
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // remove ambiguous characters such as Il1O0 to avoid confusion in printed documents

  let code = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars.charAt(randomIndex);
  }
  return code.toLocaleLowerCase();
};
