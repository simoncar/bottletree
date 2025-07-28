import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from "@react-native-firebase/firestore";
import { createUser } from "./APIuser";
import { dbm } from "./firebase";
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
  console.log("getProject project:", project);

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
    timestamp: serverTimestamp(),
    private: false,
    created: serverTimestamp(),
    star: false,
  };

  try {
    const query = collection(dbm, "projects");
    const accessListQuery = collection(dbm, "projects");
    // Use collectionGroup for "accessList"
    const accessListGroupQuery = collectionGroup(dbm, "accessList").where(
      "uid",
      "==",
      uid,
    );
    const accessListSnapshot = await getDocs(accessListGroupQuery);

    accessListSnapshot.forEach((docSnap) => {
      const projectId = docSnap.data().projectId;
      if (!projectList.includes(projectId)) {
        projectList.push(projectId);
      } else {
        console.log("This item already exists:", projectId, Date());
      }
    });

    const q = collection(dbm, "projects");
    const projectsSnapshot = await getDocs(q);

    projects.length = 0; // Clear the array
    projectsArchived.length = 0; // Clear the array

    projectsSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (projectList.includes(docSnap.id) && docSnap.id !== "demo") {
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
            timestamp: data.timestamp,
            private: data.private || false,
            created: data.created || data.timestamp,
            star: data.star || false,
          });
        } else {
          if (archived) {
            projectsArchived.push({
              project: docSnap.id,
              key: docSnap.id,
              title: data.title || "Untitled",
              icon: data.icon,
              archived: true,
              postCount: data.postCount ?? 0,
              taskCount: data.taskCount ?? 0,
              fileCount: data.fileCount ?? 0,
              timestamp: data.timestamp,
              private: data.private || false,
              created: data.created || data.timestamp,
              star: data.star || false,
            });
          }
        }
      }
      //if demo project, set the counts
      if (docSnap.id === "demo") {
        projectsDemo[0].postCount = data.postCount ?? 0;
        projectsDemo[0].taskCount = data.taskCount ?? 0;
        projectsDemo[0].fileCount = data.fileCount ?? 0;
      }
    });

    projects.forEach((project) => {
      if (!project.timestamp) {
        project.timestamp = serverTimestamp();
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
    console.error("Error fetching projects 24:", error);
    callback([]);
  }
}

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
  const accessListRef = collection(dbm, "projects", projectId, "accessList");
  const accessListSnapshot = await getDocs(accessListRef);
  const idList: string[] = [];
  accessListSnapshot.forEach((docSnap) => {
    idList.push(docSnap.data().uid);
  });

  const userList: IUser[] = [];

  if (idList.length > 0) {
    const usersRef = collection(dbm, "users");
    const usersSnapshot = await getDocs(usersRef);

    usersSnapshot.forEach((docSnap) => {
      if (idList.includes(docSnap.id)) {
        const data = docSnap.data();
        if (!data.anonymous) {
          userList.push({
            uid: docSnap.id,
            displayName: data.displayName,
            email: data.email,
            photoURL: data.photoURL,
            project: projectId,
            anonymous: !!data.anonymous,
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
    const ref = doc(dbm, "projects", projectId);

    await updateDoc(ref, {
      star: star,
      timestamp: serverTimestamp(),
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
  console.log("updateProject Begin - ref: ", ref, project);

  await updateDoc(ref, {
    title: project.title,
    icon: project?.icon ?? stockHouseIcon,
    archived: project?.archived ?? false,
    private: project?.private || false,
    timestamp: serverTimestamp(),
  });

  console.log("updateProject End - ref: ", ref, project);

  callback(project.key);
}

export async function updateProjectTimestamp(project: IProject, callback: any) {
  const ref = doc(dbm, "projects", project.key);

  await updateDoc(ref, {
    timestamp: serverTimestamp(),
  });

  callback(project.key);
}
export async function addProject(
  project: IProject,
  user: IUser,
  callback: { (id: string): void; (arg0: string): void },
) {
  try {
    const projectId = generateProjectReference();
    console.log("Adding project: ", projectId, project, user);

    // TODO: check the project reference is not already in use (unlikely)

    const projectRef = doc(dbm, "projects", projectId);

    await setDoc(projectRef, {
      title: project.title,
      icon: stockHouseIcon,
      timestamp: serverTimestamp(),
      archived: false,
      postCount: 0,
      fileCount: 0,
      taskCount: 0,
      private: project?.private || false,
      created: serverTimestamp(),
    });

    console.log("Project written with ID: ", projectId);
    callback(projectId);
  } catch (e) {
    console.error("Error adding project: ", e);
  }
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
export async function deleteProject(project: IProject, callback: any) {
  try {
    const projectRef = doc(dbm, "projects", project.key);

    await deleteDoc(projectRef);

    callback(project.key);
  } catch (e) {
    console.error("Error deleting project: ", e);
  }
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
    const accessListRef = doc(
      dbm,
      "projects",
      projectId,
      "accessList",
      user.uid,
    );
    await setDoc(
      accessListRef,
      {
        uid: user.uid,
        displayName: user.displayName,
        timestamp: serverTimestamp(),
        projectId: projectId,
      },
      { merge: true },
    );
    if (callback) {
      callback(projectId);
    } else {
      console.log("Callback not provided.");
    }
  } catch (e) {
    console.error("Error adding user to project: ", e);
  }
}

export async function deleteProjectUser(
  projectId: string,
  user: IUser,
  callback: { (id: string): void; (arg0: string): void },
) {
  try {
    const accessListRef = doc(
      dbm,
      "projects",
      projectId,
      "accessList",
      user.uid,
    );
    await deleteDoc(accessListRef);
    callback(user.uid);
  } catch (e) {
    console.error("Error deleting user from project: ", e);
  }
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
