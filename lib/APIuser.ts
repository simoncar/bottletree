import { CurrentRenderContext } from "@react-navigation/native";
import { auth, firestore } from "@/lib/firebase";
import { IUser } from "./types";

export async function getUser(
  uid: string,
  callback: { (user: IUser): void; (arg0: IUser): void },
) {
  const q = firestore().collection("users").doc(uid);

  q.get()
    .then((doc) => {
      if (doc.exists) {
        const user: IUser = {
          key: doc.id,
          uid: doc.id,
          displayName: doc.data()?.displayName,
          email: doc.data()?.email,
          photoURL: doc.data()?.photoURL,
          language: doc.data()?.language,
          project: doc.data()?.project,
          postCount: doc.data()?.postCount,
        };

        callback(user);
      } else {
        callback(null);
      }
    })
    .catch((error) => {
      console.log("getUser Error getting document:", error);
      callback(null);
    });

  return () => q;
}

export async function deleteUser(
  uid: string,
  callback: { (user: IUser): void; (arg0: IUser): void },
) {
  console.log("deleteUser: ", uid);

  const q = firestore().collection("users").doc(uid);

  q.delete()
    .then(() => {
      console.log("User successfully deleted!");
      callback(null);
    })
    .catch((error) => {
      console.error("Error removing user: ", error);
      callback(null);
    });

  return () => q;
}

export const updateAccountName = (displayName: string) => {
  const docRef1 = firestore().collection("users").doc(auth().currentUser.uid);

  const user = auth().currentUser;
  const docRef2 = user
    .updateProfile({
      displayName: displayName,
    })
    .then(() => {
      docRef1.set(
        {
          displayName: displayName,
          email: auth().currentUser.email,
          photoURL: auth().currentUser.photoURL,
        },
        { merge: true },
      );
    })
    .catch((error) => {
      console.log("upupdateAccountName update ERROR ", error);
    });
};

export const updateUserProjectCount = (project: string) => {
  const u = auth().currentUser?.uid;
  if (project === "welcome") {
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
        .doc(u)
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
      .then(() => {})
      .catch((error) => {
        console.log("updateAccountPhotoURL update ERROR ", error);
      });
  }
};

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
    });
  });

  callback(users);
}

const generateFirebaseDocIDFromEmail = (email) => {
  if (!email || typeof email !== "string") {
    throw new Error("Invalid email provided");
  }

  // Replace invalid characters for Firebase keys
  const sanitizedEmail = email.replace(/[.$#\[\]\/]/g, "_");

  // Add a random suffix to ensure uniqueness
  const suffix = Math.random().toString(36).substring(2, 8);

  return `${sanitizedEmail}_${suffix}`;
};

export async function getUserProjectCount(callback: userProjectCountRead) {
  let user: IUser;

  firestore()
    .collection("users")
    .doc(auth().currentUser.uid)
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
      };

      callback(user);
    });
}
