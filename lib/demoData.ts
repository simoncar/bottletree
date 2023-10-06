import { addDoc, doc, collection, Timestamp, setDoc } from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signOut,
  updateProfile,
  deleteUser,
} from "firebase/auth/react-native";
import { db, auth_js } from "./firebase";
import { IUser } from "./types";
import { setBadgeCountAsync } from "expo-notifications";

export const demoData2 = async () => {
  //console.log("Skip demo data");
};

export const demoData = async () => {
  console.log("DEMO DATA SEEDING");

  const users: IUser[] = [];

  users.push({
    displayName: "Simon Car",
    email: "car@simon.co",
    pushToken: "ExponentPushToken[en5SSANZy96dpSJ302wi6z]",
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface4.jpeg?alt=media&token=f8a0c905-5e0c-45c8-b91a-1e387fba33db",
  });

  users.push({
    displayName: "Lloyd Fox",
    email: "lloyd@simon.co",
    pushToken: "ExponentPushToken[en5SSANZy96dpSJ302wi6z]",
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface12.jpeg?alt=media&token=c048eee1-3673-4d5a-b35a-0e3c45a25c69",
  });

  users.push({
    displayName: "Sue Wheeler",
    email: "sue@simon.co",
    pushToken: "void",
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface10.jpeg?alt=media&token=ec4a6ece-d8a6-4d57-b960-622e451f5c18",
  });

  users.push({
    displayName: "Scarlett Hale",
    email: "scarlett@simon.co",
    pushToken: "void",
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface3.jpeg?alt=media&token=dc2bca16-60e3-44d8-8e5b-aaab28ab7dc5",
  });
  users.push({
    displayName: "Louella Barrett",
    email: "louelle@simon.co",
    pushToken: "void",
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface8.jpeg?alt=media&token=706f834e-0e01-47a3-9e54-a1e602a0911d",
  });
  users.push({
    displayName: "Aubree Mendoza",
    email: "aubree@simon.co",
    pushToken: "void",
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface11.jpeg?alt=media&token=2a87c0ba-d4fa-405e-89eb-689e8ca4b05c",
  });
  users.push({
    displayName: "Armando Bradley",
    email: "armando@simon.co",
    pushToken: "void",
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Ffacemale1.jpg?alt=media&token=2fbef981-e857-4e1d-af4b-38c5fbf14512",
  });
  console.log("a");

  users[0].uid = await createUser(users[0]);
  console.log("b");

  users[1].uid = await createUser(users[1]);
  users[2].uid = await createUser(users[2]);
  users[3].uid = await createUser(users[3]);
  users[4].uid = await createUser(users[4]);
  users[5].uid = await createUser(users[5]);
  users[6].uid = await createUser(users[6]);

  try {
    const projectRef1 = await setDoc(
      doc(db, "projects", "project11111111"),
      {
        title: "(Local) 106 Jolimont",
        icon: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FwhiteHouse.jpeg?alt=media&token=0e4f6f2d-2840-4fc3-9dac-9e3db41e6eb7",
        archived: false,
      },
      { merge: true },
    );

    const postRef1 = await setDoc(
      doc(db, "projects", "project11111111", "posts", "post1111111"),
      {
        author: "John Doe",
        avatar: "https://",
        timestamp: Timestamp.now(),
        images: [
          "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/posts%2F202307%2F36442255-2444-4043-AFA8-57E171FC0559?alt=media&token=ff922597-1dec-4822-abd0-83750e40a865",
        ],
      },
      { merge: true },
    );

    const projectRef2 = await setDoc(
      doc(db, "projects", "project22222222"),
      {
        title: "(Local) Placa Rovira",
        icon: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FroviraSmall.jpg?alt=media&token=a9d67e04-7bef-475b-88f8-4a1f35117ddc",
        archived: false,
      },
      { merge: true },
    );

    const postRef2 = await setDoc(
      doc(db, "projects", "project22222222", "posts", "post2222222"),
      {
        author: "John Doe",
        avatar: "https://",
        timestamp: Timestamp.now(),
        images: [
          "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/posts%2F202307%2F199D1629-236B-4A78-B2C6-D1C0A1689E8B?alt=media&token=a16d1ecc-dd20-4b99-a077-5cbb446d2a05",
          "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Froof%2FScreenshot%202023-05-30%20at%202.05.53%20PM.png?alt=media&token=b776cb08-fc7e-4ac6-b01b-e2ff47920c76&_gl=1*cz9bbf*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODQzMy4wLjAuMA..",
          "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Froof%2FScreenshot%202023-05-30%20at%202.05.58%20PM.png?alt=media&token=35645c96-05d4-4ffc-95e4-0b805ae91981&_gl=1*1aa7ivb*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODQzOS4wLjAuMA..",
        ],
      },
      { merge: true },
    );

    await newProjectUser("project22222222", users[0]);
    await newProjectUser("project22222222", users[1]);
    await newProjectUser("project22222222", users[2]);
    await newProjectUser("project22222222", users[5]);

    await newProjectUser("project11111111", users[0]);
    await newProjectUser("project11111111", users[1]);
    await newProjectUser("project11111111", users[2]);
    await newProjectUser("project11111111", users[3]);
    await newProjectUser("project11111111", users[4]);
    await newProjectUser("project11111111", users[5]);

    const token1 = await setDoc(
      doc(db, "tokens", "vtgZnrL-rx5viXmTI19u0u"),
      {
        displayName: "Demo User",
        pushToken: "ExponentPushToken[vtgZnrL-rx5viXmTI19u0u]",
        timestamp: Timestamp.now(),
        uid: users[0].uid,
      },
      { merge: true },
    );
    const token2 = await setDoc(
      doc(db, "tokens", "z-50OyGeRPth6nxZSWk_A4"),
      {
        displayName: "Demo User iPad",
        pushToken: "ExponentPushToken[z-50OyGeRPth6nxZSWk_A4]",
        timestamp: Timestamp.now(),
        uid: users[0].uid,
      },
      { merge: true },
    );

    const postRef3 = await setDoc(
      doc(db, "calendar", "calendar11111111"),
      {
        description:
          "A. Here is the details of the installer https://kitchen.com or give them a call",
        title: "Install the Kitchen",
        dateBegin: Timestamp.fromDate(new Date()),
        dateEnd: Timestamp.fromDate(new Date()),
        uid: "3whGasgLCJbo3NUMt19dE8D6DmV2",
        projectId: "project22222222",
      },
      { merge: true },
    );

    const date = new Date();
    date.setDate(date.getDate() + 3);
    date.setMinutes(50);
    date.setHours(16);

    const postRef4 = await setDoc(
      doc(db, "calendar", "calendar22222222"),
      {
        description:
          "B. Will use quality paint from Bunnings color code Cool Grey (#8D99AE)",
        title: "Paint the walls",
        dateBegin: Timestamp.fromDate(new Date()),
        dateEnd: Timestamp.fromDate(date),
        uid: "3whGasgLCJbo3NUMt19dE8D6DmV2",
        projectId: "project11111111",
      },
      { merge: true },
    );
  } catch (e) {
    console.error("Error adding document: ", e);
  }

  async function newProjectUser(projectId: string, user: IUser) {
    return await setDoc(
      doc(db, "projects", projectId, "users", user.uid),
      {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      },
      { merge: true },
    );
  }

  async function createUser(user: IUser) {
    const fsi2 = await fetchSignInMethodsForEmail(auth_js, user.email);

    let user2 = null;
    if (fsi2.length === 0) {
      user2 = await createUserWithEmailAndPassword(
        auth_js,
        user.email,
        "password",
      );
    } else {
      user2 = await signInWithEmailAndPassword(auth_js, user.email, "password");
    }

    const userDoc2 = await setDoc(doc(db, "users", user2.user.uid), user, {
      merge: true,
    });

    return user2.user.uid;
  }
};
