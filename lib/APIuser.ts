import { auth, db, firestore } from "@/lib/firebase";
import * as Crypto from "expo-crypto";
import { IUser } from "./types";

export async function getUser(uid: string) {
  const q = firestore().collection("users").doc(uid);
  const doc = await q.get();

  if (!auth().currentUser) {
    console.log(
      "getUser: no current auth() user, perhaps it was deleted: ",
      auth().currentUser,
    );
    return null;
  }

  if (doc.exists) {
    const user: IUser = {
      key: doc.id,
      uid: doc.id,
      displayName: doc.data()?.displayName,
      email: doc.data()?.email?.toLowerCase(),
      photoURL: doc.data()?.photoURL,
      language: doc.data()?.language,
      project: doc.data().project,
      postCount: doc.data()?.postCount,
      anonymous: auth().currentUser?.isAnonymous,
      notifications: doc.data()?.notifications ?? false,
      pushToken: doc.data()?.pushToken || "",
    };

    return user;
  } else {
    console.log(
      "firestore user NOT found:",
      "creating user",
      uid,
      auth().currentUser,
    );
    const newUser = await createUser({
      uid: uid,
      displayName: auth().currentUser.displayName || "anonymous",
      email: auth().currentUser.email?.toLowerCase() || "anonymous",
      photoURL: "",
      language: "en",
      project: "",
      anonymous: auth().currentUser.isAnonymous,
      created: firestore.Timestamp.now(),
      pushToken: "",
    });

    return newUser;
  }
}

export async function deleteUser(
  uid: string,
  callback: { (user: IUser): void; (arg0: IUser): void },
) {
  const q = firestore().collection("users").doc(uid);

  q.delete()
    .then(() => {
      callback(null);
    })
    .catch((error) => {
      console.error("Error removing user: ", error);
      callback(null);
    });

  return () => q;
}

export async function createUser(user: IUser) {
  if (!user) {
    return null;
  }

  const usersCollection = firestore().collection("users");

  let querySnapshot;

  console.log("createUser >>>>:", user);

  if (user.email != undefined && user.email !== "") {
    querySnapshot = await usersCollection
      .where("email", "==", user.email.toLowerCase())
      .get();
  } else {
    querySnapshot = await usersCollection.where("uid", "==", user.uid).get();
  }

  if (!querySnapshot.empty) {
    console.log("User already exists with email:", user.email);
    user.key = querySnapshot.docs[0].id;
    user.uid = querySnapshot.docs[0].id;
    user.displayName = querySnapshot.docs[0].data().displayName;
    user.photoURL = querySnapshot.docs[0].data().photoURL;
    user.anonymous = false;
    user.created = querySnapshot.docs[0].data().created;
    return user;
  } else {
    try {
      const UUID = Crypto.randomUUID();
      const userDoc = usersCollection.doc(user.uid);
      user.created = firestore.Timestamp.now();
      await userDoc.set(user);
      console.log("User created successfully:", user.uid);
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }
}

export async function updateUser(user: IUser) {
  Object.keys(user).forEach((key) => {
    if (user[key] === undefined) {
      delete user[key];
    }
  });
  const usersCollection = firestore().collection("users");
  const userDoc = usersCollection.doc(user.uid);
  await userDoc.set(user, { merge: true });
}
export async function updateAccountName(uid: string, displayName: string) {
  const docRef1 = firestore().collection("users").doc(uid);
  const user = auth().currentUser;

  console.log("updateAccountName:", user, uid, displayName);
  if (displayName == undefined || displayName == null) {
    displayName = user.displayName;
  }

  try {
    await user.updateProfile({
      displayName: displayName,
    });

    const doc = await docRef1.get();
    const updateData: any = {
      displayName: displayName,
      email: auth().currentUser.email
        ? auth().currentUser.email.toLocaleLowerCase()
        : "",
      photoURL: auth().currentUser.photoURL ? auth().currentUser.photoURL : "",
      anonymous: auth().currentUser.isAnonymous,
    };

    if (!doc.exists) {
      updateData.created = firestore.Timestamp.now();
    }

    await docRef1.set(updateData, { merge: true });
  } catch (error) {
    console.log("updateAccountName update ERROR ", error);
  }
}

export const updateUserProjectCount = (uid: string, project: string) => {
  if (uid === null || project == undefined) {
    return;
  }

  const docRef = firestore().collection("projects").doc(project);
  let count = 0;
  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        if (typeof doc.data().postCount === "number") {
          count = doc.data().postCount;
        }
      }
    })
    .then(() => {
      firestore()
        .collection("users")
        .doc(uid)
        .set(
          {
            project: project,
            postCount: {
              [project]: count,
            },
          },
          { merge: true },
        )
        .then(() => {
          //console.log("User's project count updated successfully!");
        })
        .catch((error) => {
          console.log("Error updating user's project count:", error);
        });
    });
};

export const updateAccountPhotoURL = (photoURL: string) => {
  const a = auth().currentUser;
  if (a) {
    const docRef1 = firestore().collection("users").doc(a?.uid);

    const user = auth().currentUser;

    user
      .updateProfile({
        photoURL: photoURL,
      })
      .then(() => {
        docRef1.set(
          {
            photoURL: photoURL,
            email: auth().currentUser.email.toLocaleLowerCase(),
            displayName: auth().currentUser.displayName,
          },
          { merge: true },
        );
      })
      .catch((error) => {
        console.log("updateAccountPhotoURL update ERROR ", error);
      });
  }
};

type usersRead = (users: IUser[]) => void;

export async function getUsers(callback: usersRead) {
  const users: IUser[] = [];

  const q = firestore().collection("users").orderBy("displayName", "asc");

  const usersSnapshot = await q.get();

  usersSnapshot.forEach((doc) => {
    users.push({
      key: doc.id,
      uid: doc.id,
      displayName: doc.data().displayName,
      email: doc.data().email.toLowerCase(),
      photoURL: doc.data().photoURL,
      language: doc.data().language,
      project: doc.data().project,
      anonymous: doc.data().isAnonymous ?? false,
      pushToken: doc.data().pushToken || "",
    });
  });

  callback(users);
}

type userProjectCountRead = (user: IUser) => void;

export async function getUserProjectCount(
  uid: string,
  callback: userProjectCountRead,
) {
  let user: IUser;

  firestore()
    .collection("users")
    .doc(uid)
    .get()
    .then((doc) => {
      user = {
        key: doc.id,
        uid: doc.id,
        displayName: doc.data()?.displayName,
        email: doc.data()?.email?.toLowerCase(),
        photoURL: doc.data()?.photoURL,
        postCount: doc.data()?.postCount,
        language: doc.data()?.language,
        project: doc.data()?.project,
        anonymous: auth().currentUser.isAnonymous,
        pushToken: doc.data()?.pushToken || "",
      };

      callback(user);
    });
}

//create an export function that accepts an old user and an a new user then it looks for all the records in the project accessList collection for the old user and updates them to the new user
export const mergeUser = (oldUid: string, newUser: IUser) => {
  console.log("merge user const : oldUser:", oldUid, "newUser:", newUser);
  if (!oldUid || !newUser || !newUser.uid) {
    console.log("Invalid oldUid or newUser");
    return;
  }
  const q = db.collectionGroup("accessList").where("uid", "==", oldUid);

  q.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      db.collection("projects")
        .doc(doc.data().projectId)
        .collection("accessList")
        .add({
          displayName: newUser?.displayName || "",
          projectId: doc.data().projectId,
          timestamp: firestore.Timestamp.now(),
          uid: newUser.uid,
        });
    });
  });
};

export async function updateAllUsersEmailToLowerCase() {
  const usersCollection = firestore().collection("users");
  const snapshot = await usersCollection.get();

  const batch = firestore().batch();

  snapshot.forEach((doc) => {
    const userData = doc.data();
    if (userData.email) {
      batch.update(doc.ref, {
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
