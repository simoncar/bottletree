import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "@react-native-firebase/firestore";
import { createUser } from "./APIuser";
import { db, dbm, firestore } from "./firebase";
import { IProject, IUser } from "./types";

type projectsRead = (projects: IProject[]) => void;
const stockHouseIcon =
  "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fhouse.png?alt=media&token=d49c7085-03f3-4115-ab17-21683d33ff07";

export function getProject(
  project: string,
  callback: { (project: IProject): void; (arg0: IProject): void },
) {
  if (!project) {
    callback(null);
    return;
  }

  const projectRef = doc(dbm, "projects", project);

  const unsubscribe = onSnapshot(projectRef, (docSnap) => {
    if (!docSnap.exists()) {
      console.log("No such project:", project);
      callback(null);
      return;
    }
    const data = docSnap.data();
    const returnProject: IProject = {
      project: docSnap.id,
      key: docSnap.id,
      title: data.title || "Untitled",
      icon: data.icon,
      archived: data.archived,
      postCount: data.postCount ?? 0,
      taskCount: data.taskCount ?? 0,
      fileCount: data.fileCount ?? 0,
      private: data.private || false,
      timestamp: data.timestamp,
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
  const projectsDemo: IProject[] = [];

  if (!uid) {
    callback(null);
    return;
  }

  projectsDemo[0] = {
    project: "demo",
    key: "demo",
    title: "Demo Project",
    icon: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/project%2Fdemo%2Fimages%2Fd0dd21df-e9fd-4d8f-a41a-b58deba7259c?alt=media&token=b9b74300-99aa-42b0-a069-676c5f6d62a1",
    archived: false,
    postCount: 0,
    fileCount: 0,
    taskCount: 0,
    timestamp: firestore.Timestamp.now(),
    private: false,
    created: firestore.Timestamp.now(),
    star: false,
  };

  try {
    const query = db.collectionGroup("accessList").where("uid", "==", uid);
    const accessListSnapshot = await query.get();

    accessListSnapshot.forEach((doc) => {
      projectList.indexOf(doc.data().projectId) === -1
        ? projectList.push(doc.data().projectId)
        : console.log(
            "This item already exists:",
            doc.data().projectId,
            Date(),
          );
    });

    const q = db.collection("projects");
    const projectsSnapshot = await q.get();

    projects.length = 0; // Clear the array
    projectsArchived.length = 0; // Clear the array

    projectsSnapshot.forEach((doc) => {
      if (projectList.includes(doc.id) && doc.id !== "demo") {
        if (!doc.data().archived) {
          projects.push({
            project: doc.id,
            key: doc.id,
            title: doc.data().title || "Untitled",
            icon: doc.data().icon,
            archived: false,
            postCount: doc.data().postCount ?? 0,
            taskCount: doc.data().taskCount ?? 0,
            fileCount: doc.data().fileCount ?? 0,
            timestamp: doc.data().timestamp,
            private: doc.data().private || false,
            created: doc.data().created || doc.data().timestamp,
            star: doc.data().star || false,
          });
        } else {
          if (archived) {
            projectsArchived.push({
              project: doc.id,
              key: doc.id,
              title: doc.data().title || "Untitled",
              icon: doc.data().icon,
              archived: true,
              postCount: doc.data().postCount ?? 0,
              taskCount: doc.data().taskCount ?? 0,
              fileCount: doc.data().fileCount ?? 0,
              timestamp: doc.data().timestamp,
              private: doc.data().private || false,
              created: doc.data().created || doc.data().timestamp,
              star: doc.data().star || false,
            });
          }
        }
      }
      //if demo project, set the counts
      if (doc.id === "demo") {
        projectsDemo[0].postCount = doc.data().postCount ?? 0;
        projectsDemo[0].taskCount = doc.data().taskCount ?? 0;
        projectsDemo[0].fileCount = doc.data().fileCount ?? 0;
      }
    });

    projects.forEach((project) => {
      if (!project.timestamp) {
        project.timestamp = new firestore.Timestamp(631152000, 0);
      }
      if (!project.created) {
        project.created = project.timestamp;
      }
    });

    projects.sort((a, b) => {
      if (a.star === b.star) {
        return b.timestamp?.seconds - a.timestamp?.seconds;
      }
      return a.star ? -1 : 1;
    });

    projectsArchived.sort((a, b) => {
      return b.timestamp?.seconds - a.timestamp?.seconds;
    });

    const allProjects = [...projects, ...projectsArchived];
    if (!allProjects.some((project) => project.key === "demo")) {
      allProjects.push(...projectsDemo);
    }
    callback(allProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    callback([]);
  }
}
// Modular Firestore API version

export async function getAllProjects(callback: projectsRead) {
  const projects: IProject[] = [];
  const projectsArchived: IProject[] = [];

  const q = collection(dbm, "projects");
  const projectsSnapshot = await getDocs(q);

  projectsSnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (!data.archived) {
      projects.push({
        project: docSnap.id,
        key: docSnap.id,
        title: data.title || "Untitled",
        icon: data.icon,
        archived: false,
        postCount: data.postCount ?? 0,
        taskCount: data.taskCount ?? 0,
        fileCount: data.fileCount ?? 0,
        private: data.private || false,
      });
    } else {
      projectsArchived.push({
        project: docSnap.id,
        key: docSnap.id,
        title: data.title || "Untitled",
        icon: data.icon,
        archived: true,
        postCount: data.postCount ?? 0,
        taskCount: data.taskCount ?? 0,
        fileCount: data.fileCount ?? 0,
        private: data.private || false,
      });
    }
  });

  callback([...projects, ...projectsArchived]);
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
export async function setStar(
  projectId: string,
  star: boolean,
  callback?: { (id: string): void; (arg0: string): void },
) {
  try {
    const ref = db.collection("projects").doc(projectId);

    await ref.update({
      star: star,
      timestamp: firestore.Timestamp.now(),
    });

    if (callback) {
      callback(projectId);
    } else {
      console.log("Callback not provided.");
    }
  } catch (e) {
    console.error("Error setting star property: ", e);
  }
}
export async function updateProject(project: IProject, callback: any) {
  const ref = doc(dbm, "projects", project.key);

  await updateDoc(ref, {
    title: project.title,
    icon: project?.icon ?? stockHouseIcon,
    archived: project?.archived ?? false,
    private: project?.private || false,
    timestamp: firestore.Timestamp.now(),
  });

  callback(project.key);
}

export async function updateProjectTimestamp(project: IProject, callback: any) {
  const ref = doc(dbm, "projects", project.key);

  await updateDoc(ref, {
    timestamp: firestore.Timestamp.now(),
  });

  callback(project.key);
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
        fileCount: 0,
        taskCount: 0,
        private: project?.private || false,
        created: firestore.Timestamp.now(),
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

//create a function, like archiveAllProjects, to delete all projects that have no posts and a timestamp older than 30 days
//this will be useful for cleaning up old projects that have been abandoned
//this function should also delete all posts and comments associated with the project
//this function should also delete all users from the accessList for the project

export function deleteProject(project: IProject, callback: any) {
  try {
    const ref = db.collection("projects").doc(project.key);

    ref.delete().then(() => {
      callback(project.key);
    });
  } catch (e) {
    console.error("Error deleting project: ", e);
  }

  return;
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
