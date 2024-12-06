import { auth, db, firestore } from "@/lib/firebase";
import { IUser } from "./types";

export async function getUser(uid: string) {
  const q = firestore().collection("users").doc(uid);
  const doc = await q.get();

  if (doc.exists) {
    const user: IUser = {
      key: doc.id,
      uid: doc.id,
      displayName: doc.data()?.displayName,
      email: doc.data()?.email,
      photoURL: doc.data()?.photoURL,
      language: doc.data()?.language,
      project: doc.data().project,
      postCount: doc.data()?.postCount,
      anonymous: auth().currentUser?.isAnonymous,
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
      displayName: auth().currentUser.displayName,
      email: auth().currentUser.email,
      photoURL: "",
      language: "en",
      project: "",
      anonymous: auth().currentUser.isAnonymous,
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
  const usersCollection = firestore().collection("users");

  let querySnapshot;

  console.log("createUser:", user);
  console.log("createUserUID:", user.uid);

  if (user.email != undefined) {
    querySnapshot = await usersCollection
      .where("email", "==", user.email)
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
    return user;
  } else {
    try {
      const userDoc = usersCollection.doc(user.uid);
      await userDoc.set(user);
      console.log("User created successfully:", user.uid);
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }
}

export async function updateAccountName(uid: string, displayName: string) {
  const docRef1 = firestore().collection("users").doc(uid);
  const user = auth().currentUser;

  console.log("updateAccountName:", user, uid, displayName);

  try {
    await user.updateProfile({
      displayName: displayName,
    });
    await docRef1.set(
      {
        displayName: displayName,
        email: auth().currentUser.email,
        photoURL: auth().currentUser.photoURL
          ? auth().currentUser.photoURL
          : "",
        anonymous: auth().currentUser.isAnonymous,
      },
      { merge: true },
    );
  } catch (error) {
    console.log("upupdateAccountName update ERROR ", error);
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
          console.log("User's project count updated successfully!");
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
            email: auth().currentUser.email,
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
      email: doc.data().email,
      photoURL: doc.data().photoURL,
      language: doc.data().language,
      project: doc.data().project,
      anonymous: auth().currentUser.isAnonymous,
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
        email: doc.data()?.email,
        photoURL: doc.data()?.photoURL,
        postCount: doc.data()?.postCount,
        language: doc.data()?.language,
        project: doc.data()?.project,
        anonymous: auth().currentUser.isAnonymous,
      };

      callback(user);
    });
}

//create an export function that accepts an old user and an a new user then it looks for all the records in the project accessList collection for the old user and updates them to the new user
export const mergeUser = (oldUid: string, newUser: IUser) => {
  const q = db.collectionGroup("accessList").where("uid", "==", oldUid);
  console.log("merge user const : oldUser:", oldUid, "newUser:", newUser);

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
