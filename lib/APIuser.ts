import { auth, dbm, firestore, updateProfile } from "@/lib/firebase";
// Use conditional imports for web vs native environments
import { Platform } from "react-native";

let firestoreImports: any;

if (Platform.OS === "web") {
  firestoreImports = require("firebase/firestore");
} else {
  firestoreImports = require("@react-native-firebase/firestore");
}

const {
  arrayRemove,
  arrayUnion,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} = firestoreImports;
import * as Device from "expo-device";
import { IUser } from "./types";

export async function getUser(uid: string) {
  console.log("getUser: ", uid);

  const userDocRef = doc(dbm, "users", uid);
  const docSnap = await getDoc(userDocRef);

  if (!auth.currentUser) {
    console.log(
      "getUser: no current auth() user, perhaps it was deleted: ",
      auth.currentUser,
    );
    return null;
  }

  if (docSnap.exists()) {
    const data = docSnap.data();
    const user: IUser = {
      key: docSnap.id,
      uid: docSnap.id,
      displayName: data?.displayName,
      email: data?.email?.toLowerCase(),
      photoURL: data?.photoURL,
      language: data?.language,
      project: data?.project,
      postCount: data?.postCount,
      anonymous: auth.currentUser?.isAnonymous,
      notifications: data?.notifications ?? false,
      pushToken: data?.pushToken || "",
    };

    return user;
  } else {
    console.log(
      "firestore user NOT found:",
      "creating user",
      uid,
      auth.currentUser,
    );
    const newUser: IUser = {
      uid: uid,
      displayName: auth.currentUser.displayName || "anonymous",
      email: auth.currentUser.email?.toLowerCase() || "anonymous",
      photoURL: "",
      language: "en",
      project: "",
      anonymous: auth.currentUser.isAnonymous,
      created: serverTimestamp(),
      pushToken: "",
    };

    await setDoc(userDocRef, newUser);

    return newUser;
  }
}

export async function deleteUser(
  uid: string,
  callback: (user: IUser | null) => void,
) {
  const userDocRef = doc(dbm, "users", uid);

  try {
    await deleteDoc(userDocRef);
    callback(null);
  } catch (error) {
    console.error("Error removing user: ", error);
    callback(null);
  }

  return () => userDocRef;
}

export async function createUser(user: IUser) {
  if (!user) {
    return null;
  }

  const usersCollectionRef = collection(dbm, "users");

  //   let querySnapshot;

  console.log("createUser >>>>:", user);

  //   if (user.email !== undefined && user.email !== "") {
  //     const q = query(
  //       usersCollectionRef,
  //       where("email", "==", user.email.toLowerCase()),
  //     );
  //     querySnapshot = await getDocs(q);
  //   } else {
  //     const q = query(usersCollectionRef, where("uid", "==", user.uid));
  //     querySnapshot = await getDocs(q);
  //   }

  //   if (!querySnapshot.empty) {
  //     const docSnap = querySnapshot.docs[0];
  //     console.log("User already exists with email:", user.email);
  //     user.key = docSnap.id;
  //     user.uid = docSnap.id;
  //     user.displayName = docSnap.data().displayName;
  //     user.photoURL = docSnap.data().photoURL;
  //     user.anonymous = false;
  //     user.created = docSnap.data().created;
  //     return user;
  //   } else {
  try {
    user.created = serverTimestamp();

    if (!user.language) {
      user.language = "en";
    }

    // Remove undefined properties from user object
    Object.keys(user).forEach((key) => {
      if (user[key] === undefined) {
        delete user[key];
      }
    });

    const userDocRef = doc(usersCollectionRef, user.uid);
    await setDoc(userDocRef, user);
    console.log("User created successfully:", user.uid);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
  // }
}
// Modular API version

// Update user document with merge, removing undefined fields
export async function updateUser(user: IUser) {
  // Remove undefined fields
  Object.keys(user).forEach((key) => {
    if (user[key] === undefined) {
      delete user[key];
    }
  });
  const userDocRef = doc(dbm, "users", user.uid);
  await setDoc(userDocRef, user, { merge: true });
}

// Update account displayName and sync to Firestore
export async function updateAccountName(uid: string, displayName: string) {
  const user = auth.currentUser;

  console.log("updateAccountName:", user, uid, displayName);

  if (!displayName) {
    displayName = user?.displayName || "";
  }

  try {
    if (user) {
      await updateProfile(user, { displayName });
    }

    const userDocRef = doc(dbm, "users", uid);
    const docSnap = await getDoc(userDocRef);

    const updateData: any = {
      displayName,
      email: user?.email ? user.email.toLowerCase() : "",
      photoURL: user?.photoURL || "",
      anonymous: user?.isAnonymous,
    };

    if (!docSnap.exists()) {
      updateData.created = new Date();
    }

    await setDoc(userDocRef, updateData, { merge: true });
  } catch (error) {
    console.log("updateAccountName update ERROR ", error);
  }
}
export const updateUserProjectCount = async (uid: string, project: string) => {
  if (!uid || !project) {
    return;
  }

  const projectDocRef = doc(dbm, "projects", project);
  const userDocRef = doc(dbm, "users", uid);

  let count = 0;
  const projectDocSnap = await getDoc(projectDocRef);

  if (projectDocSnap.exists()) {
    const data = projectDocSnap.data();
    if (typeof data.postCount === "number") {
      count = data.postCount;
    }
  }

  try {
    await setDoc(
      userDocRef,
      {
        project: project,
        postCount: {
          [project]: count,
        },
      },
      { merge: true },
    );
    //console.log("User's project count updated successfully!");
  } catch (error) {
    console.log("Error updating user's project count:", error);
  }
};

export async function updateAccountPhotoURL(photoURL: string) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await updateProfile(user, { photoURL });

    const userDocRef = doc(dbm, "users", user.uid);

    await setDoc(
      userDocRef,
      {
        photoURL,
        email: user.email?.toLowerCase() || "",
        displayName: user.displayName || "",
      },
      { merge: true },
    );
  } catch (error) {
    console.log("updateAccountPhotoURL update ERROR ", error);
  }
}

type usersRead = (users: IUser[]) => void;

export async function getUsers(callback: usersRead) {
  const users: IUser[] = [];

  const usersCollectionRef = collection(dbm, "users");
  const q = query(usersCollectionRef /* You can add orderBy here if needed */);

  const usersSnapshot = await getDocs(q);

  usersSnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    users.push({
      key: docSnap.id,
      uid: docSnap.id,
      displayName: data.displayName,
      email: data.email?.toLowerCase(),
      photoURL: data.photoURL,
      language: data.language,
      project: data.project,
      anonymous: data.isAnonymous ?? false,
      pushToken: data.pushToken || "",
    });
  });

  callback(users);
}

type userProjectCountRead = (user: IUser) => void;
export async function getUserProjectCount(
  uid: string,
  callback: userProjectCountRead,
) {
  const userDocRef = doc(dbm, "users", uid);
  const docSnap = await getDoc(userDocRef);

  if (!docSnap.exists()) {
    callback(null as any);
    return;
  }

  const data = docSnap.data();
  const user: IUser = {
    key: docSnap.id,
    uid: docSnap.id,
    displayName: data?.displayName,
    email: data?.email?.toLowerCase(),
    photoURL: data?.photoURL,
    postCount: data?.postCount,
    language: data?.language,
    project: data?.project,
    anonymous: auth.currentUser?.isAnonymous,
    pushToken: data?.pushToken || "",
  };

  callback(user);
}

// Export function to merge user accessList records using Firebase Modular API
export const mergeUser = async (oldUid: string, newUser: IUser) => {
  console.log("merge user const: oldUser:", oldUid, "newUser:", newUser);
  if (!oldUid || !newUser || !newUser.uid) {
    console.log("Invalid oldUid or newUser");
    return;
  }

  const accessListQuery = query(
    collectionGroup(dbm, "accessList"),
    where("uid", "==", oldUid),
  );
  const querySnapshot = await getDocs(accessListQuery);

  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();
    const projectId = data.projectId;
    if (!projectId) continue;

    const accessListDocRef = doc(
      dbm,
      "projects",
      projectId,
      "accessList",
      newUser.uid,
    );

    await setDoc(
      accessListDocRef,
      {
        displayName: newUser.displayName || "",
        projectId: projectId,
        timestamp: serverTimestamp(),
        uid: newUser.uid,
      },
      { merge: true },
    );

    // Sync allowedUsers
    const projectRef = doc(dbm, "projects", projectId);
    await updateDoc(projectRef, {
      allowedUsers: arrayRemove(oldUid),
    });
    await updateDoc(projectRef, {
      allowedUsers: arrayUnion(newUser.uid),
    });
  }
};

export async function updateAllUsersEmailToLowerCase() {
  const usersCollectionRef = collection(dbm, "users");
  const snapshot = await getDocs(usersCollectionRef);

  const batch = firestore().batch();

  snapshot.forEach((docSnap) => {
    const userData = docSnap.data();
    if (userData.email) {
      batch.update(docSnap.ref, {
        email: userData.email.toLowerCase(),
      });
    }
  });

  try {
    await batch.commit();
    console.log("Successfully updated all user emails to lowercase");
  } catch (error) {
    console.error("Error updating user emails:", error);
  }
}

export const updateUserPushToken = async (uid: string, pushToken: string) => {
  if (!uid || !pushToken) {
    return;
  }

  if (!Device.isDevice) {
    console.log("Not a device, pushToken update skipped.");
    return;
  }

  const userDocRef = doc(dbm, "users", uid);

  try {
    await setDoc(userDocRef, { pushToken }, { merge: true });
    console.log("User's pushToken updated successfully!");
  } catch (error) {
    console.log("Error updating user's pushToken:", error);
  }
};
// Function to set the user's lastLogin timestamp using Modular API
export const updateUserLastLogin = async (uid: string) => {
  if (!uid) {
    return;
  }

  const userDocRef = doc(dbm, "users", uid);

  try {
    await setDoc(
      userDocRef,
      {
        lastLogin: serverTimestamp(),
      },
      { merge: true },
    );
    console.log("User's lastLogin updated successfully!");
  } catch (error) {
    console.log("Error updating user's lastLogin:", error);
  }
};
