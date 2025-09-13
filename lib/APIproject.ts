import { Platform } from "react-native";

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
  arrayUnion,
  arrayRemove,
  query,
  where,
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
    if (!docSnap) {
      callback(null);
      return;
    }
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
      created: data.created,
      star: data.star,
      allowedUsers: data.allowedUsers,
      owner: data.owner,
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
    allowedUsers: [], // Populate based on demo users if needed
    owner: "",
  };

  try {
    const q = query(
      collection(dbm, "projects"),
      where("allowedUsers", "array-contains", uid),
    );
    const projectsSnapshot = await getDocs(q);

    projects.length = 0;
    projectsArchived.length = 0;

    if (projectsSnapshot) {
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
            timestamp: data.timestamp,
            private: data.private || false,
            created: data.created || data.timestamp,
            star: data.star || false,
            allowedUsers: data.allowedUsers,
            owner: data.owner,
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
              allowedUsers: data.allowedUsers,
              owner: data.owner,
            });
          }
        }
        if (docSnap.id === "demo") {
          projectsDemo[0].postCount = data.postCount ?? 0;
          projectsDemo[0].taskCount = data.taskCount ?? 0;
          projectsDemo[0].fileCount = data.fileCount ?? 0;
          projectsDemo[0].allowedUsers = data.allowedUsers;
          projectsDemo[0].owner = data.owner;
        }
      });
    } else {
      console.error("projectsSnapshot is null or does not have forEach method");
    }

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
    console.error("Error fetching projects:", error);
    callback([]);
  }
}

export async function addProject(
  project: IProject,
  user: IUser,
  callback: { (id: string): void; (arg0: string): void },
) {
  try {
    const projectId = generateProjectReference();
    console.log("Adding project:", projectId, project, user);

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
      owner: user.uid,
      allowedUsers: [user.uid],
    });

    console.log("Project written with ID:", projectId);
    callback(projectId);
  } catch (e) {
    console.error("Error adding project:", e);
  }
}

export async function addProjectUser(
  projectId: string,
  user: IUser,
  callback?: { (id: string): void; (arg0: string): void },
) {
  console.log("Adding user to project (Before):", projectId, user);

  user = await createUser(user);

  console.log("Adding user to project (After):", projectId, user);

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

    const projectRef = doc(dbm, "projects", projectId);
    await updateDoc(projectRef, {
      allowedUsers: arrayUnion(user.uid),
    });

    if (callback) {
      callback(projectId);
    } else {
      console.log("Callback not provided.");
    }
  } catch (e) {
    console.error("Error adding user to project:", e);
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

    const projectRef = doc(dbm, "projects", projectId);
    await updateDoc(projectRef, {
      allowedUsers: arrayRemove(user.uid),
    });

    callback(user.uid);
  } catch (e) {
    console.error("Error deleting user from project:", e);
  }
}

export async function updateProject(project: IProject, callback: any) {
  const ref = doc(dbm, "projects", project.key);
  console.log("updateProject Begin - ref:", ref, project);

  await updateDoc(ref, {
    title: project.title,
    icon: project?.icon ?? stockHouseIcon,
    archived: project?.archived ?? false,
    private: project?.private || false,
    timestamp: serverTimestamp(),
  });

  console.log("updateProject End - ref:", ref, project);

  callback(project.key);
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

const generateProjectReference = (): string => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // remove ambiguous characters such as Il1O0 to avoid confusion in printed documents

  let code = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars.charAt(randomIndex);
  }
  return code.toLocaleLowerCase();
};

//create an export function called getProjectUsers that accepts a project ID and a callback function of the users for the project
export const getProjectUsers = (
  projectId: string,
  callback: (users: IUser[]) => void,
) => {
  const users: IUser[] = []; // This will hold the users for the project

  // Fetch users from the database (mocked here as an example)
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(dbm, "projects", projectId, "accessList"),
      );
      querySnapshot.forEach((doc) => {
        const user = doc.data() as IUser;
        users.push(user);
      });
      callback(users);
    } catch (error) {
      console.error("Error fetching project users:", error);
      callback([]);
    }
  };

  fetchUsers();
};
