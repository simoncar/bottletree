import {
  doc,
  setDoc,
  Timestamp,
  serverTimestamp,
  arrayUnion,
  updateDoc,
} from "@/lib/firebase";

import {
  auth,
  createUserWithEmailAndPassword,
  dbm,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
} from "./firebase";
import { IUser } from "./types";

export const demoData2 = async () => {
  //console.log("Skip demo data");
};

export const demoData = async () => {
  console.log("DEMO DATA SEEDING");

  const users: IUser[] = [
    {
      displayName: "Simon Car",
      email: "car@simon.co",
      pushToken: "ExponentPushToken[en5SSANZy96dpSJ302wi6z]",
      photoURL:
        "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface4.jpeg?alt=media&token=f8a0c905-5e0c-45c8-b91a-1e387fba33db",
      project: "",
      anonymous: false,
    },
    {
      displayName: "Lloyd Fox",
      email: "lloyd@simon.co",
      pushToken: "ExponentPushToken[en5SSANZy96dpSJ302wi6z]",
      photoURL:
        "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface12.jpeg?alt=media&token=c048eee1-3673-4d5a-b35a-0e3c45a25c69",
      project: "",
      anonymous: false,
    },
    {
      displayName: "Sue Wheeler",
      email: "sue@simon.co",
      pushToken: "void",
      photoURL:
        "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface10.jpeg?alt=media&token=ec4a6ece-d8a6-4d57-b960-622e451f5c18",
      project: "",
      anonymous: false,
    },
    {
      displayName: "Scarlett Hale",
      email: "scarlett@simon.co",
      pushToken: "void",
      photoURL:
        "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface3.jpeg?alt=media&token=dc2bca16-60e3-44d8-8e5b-aaab28ab7dc5",
      project: "",
      anonymous: false,
    },
    {
      displayName: "Louella Barrett",
      email: "louelle@simon.co",
      pushToken: "void",
      photoURL:
        "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface8.jpeg?alt=media&token=706f834e-0e01-47a3-9e54-a1e602a0911d",
      project: "",
      anonymous: false,
    },
    {
      displayName: "Aubree Mendoza",
      email: "aubree@simon.co",
      pushToken: "void",
      photoURL:
        "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface11.jpeg?alt=media&token=2a87c0ba-d4fa-405e-89eb-689e8ca4b05c",
      project: "",
      anonymous: false,
    },
    {
      displayName: "Armando Bradley",
      email: "armando@simon.co",
      pushToken: "void",
      photoURL:
        "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Ffacemale1.jpg?alt=media&token=2fbef981-e857-4e1d-af4b-38c5fbf14512",
      project: "",
      anonymous: false,
    },
  ];

  for (let i = 0; i < users.length; i++) {
    //users[i].uid = await createUser(users[i]);
  }

  try {
    console.log("Current user:", auth.currentUser?.uid);

    await setDoc(
      doc(dbm, "projects", "project106joli"),
      {
        title: "Local 106 Jolimont",
        icon: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FwhiteHouse.jpeg?alt=media&token=0e4f6f2d-2840-4fc3-9dac-9e3db41e6eb7",
        archived: false,
        postCount: 109,
        timestamp: serverTimestamp(),
        owner: auth.currentUser?.uid,
        allowedUsers: [auth.currentUser?.uid],
      },
      { merge: true },
    );

    await setDoc(
      doc(dbm, "projects/project106joli/posts/post1111111"),
      {
        author: "John Doe",
        avatar: "https://",
        timestamp: serverTimestamp(),
        images: [
          "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/posts%2F202307%2F36442255-2444-4043-AFA8-57E171FC0559?alt=media&token=ff922597-1dec-4822-abd0-83750e40a865",
        ],
      },
      { merge: true },
    );

    await setDoc(
      doc(dbm, "projects", "project7rovira"),
      {
        title: "Local Placa Rovira",
        icon: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FroviraSmall.jpg?alt=media&token=a9d67e04-7bef-475b-88f8-4a1f35117ddc",
        archived: false,
        postCount: 7,
        timestamp: serverTimestamp(),
        owner: auth.currentUser?.uid,
        allowedUsers: [auth.currentUser?.uid],
      },
      { merge: true },
    );

    await setDoc(
      doc(dbm, "projects/project7rovira/posts/post2222222"),
      {
        author: "John Doe",
        avatar: "https://",
        timestamp: serverTimestamp(),
        images: [
          "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/posts%2F202307%2F199D1629-236B-4A78-B2C6-D1C0A1689E8B?alt=media&token=a16d1ecc-dd20-4b99-a077-5cbb446d2a05",
          "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Froof%2FScreenshot%202023-05-30%20at%202.05.53%20PM.png?alt=media&token=b776cb08-fc7e-4ac6-b01b-e2ff47920c76&_gl=1*cz9bbf*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODQzMy4wLjAuMA..",
          "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Froof%2FScreenshot%202023-05-30%20at%202.05.58%20PM.png?alt=media&token=35645c96-05d4-4ffc-95e4-0b805ae91981&_gl=1*1aa7ivb*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODQzOS4wLjAuMA..",
        ],
      },
      { merge: true },
    );

    await setDoc(
      doc(dbm, "projects/project7rovira/files/file11111"),
      {
        key: "file1111",
        filename: "House Plans version 1",
        url: "https://file.location/filename.txt",
        created: serverTimestamp(),
        modified: serverTimestamp(),
        mimeType: "application/pdf",
        bytes: 5242880,
        projectId: "project7rovira",
      },
      { merge: true },
    );

    await setDoc(
      doc(dbm, "projects/project7rovira/files/file2222"),
      {
        key: "file1111",
        filename: "Bathroom Plans",
        url: "https://file.location/filename.txt",
        created: serverTimestamp(),
        modified: serverTimestamp(),
        mimeType: "application/pdf",
        bytes: 6242880,
        projectId: "project7rovira",
      },
      { merge: true },
    );

    await setDoc(
      doc(dbm, "projects/project7rovira/files/file3333"),
      {
        key: "file1111",
        filename: "Certificate of Occupancy",
        url: "https://file.location/filename.txt",
        created: serverTimestamp(),
        modified: serverTimestamp(),
        mimeType: "application/pdf",
        bytes: 6242880,
        projectId: "project7rovira",
      },
      { merge: true },
    );

    await setDoc(
      doc(dbm, "projects", "demo"),
      {
        title: "Demo",
        icon: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FroviraSmall.jpg?alt=media&token=a9d67e04-7bef-475b-88f8-4a1f35117ddc",
        archived: false,
        postCount: 7,
        timestamp: serverTimestamp(),
        allowedUsers: [auth.currentUser?.uid],
        owner: auth.currentUser?.uid,
      },
      { merge: true },
    );

    await setDoc(
      doc(dbm, "projects/demo/posts/welcomePost"),
      {
        author: "John Doe",
        avatar: "https://",
        timestamp: serverTimestamp(),
        images: [
          "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/posts%2F202307%2F199D1629-236B-4A78-B2C6-D1C0A1689E8B?alt=media&token=a16d1ecc-dd20-4b99-a077-5cbb446d2a05",
          "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Froof%2FScreenshot%202023-05-30%20at%202.05.53%20PM.png?alt=media&token=b776cb08-fc7e-4ac6-b01b-e2ff47920c76&_gl=1*cz9bbf*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODQzMy4wLjAuMA..",
          "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Froof%2FScreenshot%202023-05-30%20at%202.05.58%20PM.png?alt=media&token=35645c96-05d4-4ffc-95e4-0b805ae91981&_gl=1*1aa7ivb*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODQzOS4wLjAuMA..",
        ],
      },
      { merge: true },
    );

    // await newProjectUser("project7rovira", users[0]);
    // await newProjectUser("project7rovira", users[1]);
    // await newProjectUser("project7rovira", users[2]);
    // await newProjectUser("project7rovira", users[5]);
    // await newProjectUser("project7rovira", users[5]);

    // await newProjectUser("demo", users[0]);
    // await newProjectUser("demo", users[1]);
    // await newProjectUser("demo", users[2]);
    // await newProjectUser("demo", users[5]);
    // await newProjectUser("demo", users[5]);

    // await newProjectUser("project106joli", users[0]);
    // await newProjectUser("project106joli", users[1]);
    // await newProjectUser("project106joli", users[2]);
    // await newProjectUser("project106joli", users[3]);
    // await newProjectUser("project106joli", users[4]);
    // await newProjectUser("project106joli", users[5]);
    // await newProjectUser("project106joli", users[5]);

    await setDoc(
      doc(dbm, "tokens", "vtgZnrL-rx5viXmTI19u0u"),
      {
        displayName: "Demo User",
        pushToken: "ExponentPushToken[vtgZnrL-rx5viXmTI19u0u]",
        timestamp: serverTimestamp(),
        uid: auth.currentUser?.uid,
      },
      { merge: true },
    );

    await setDoc(
      doc(dbm, "tokens", "z-50OyGeRPth6nxZSWk_A4"),
      {
        displayName: "Demo User iPad",
        pushToken: "ExponentPushToken[z-50OyGeRPth6nxZSWk_A4]",
        timestamp: serverTimestamp(),
        uid: auth.currentUser?.uid,
      },
      { merge: true },
    );
  } catch (e) {
    console.error("Error adding document (from demo data ): ", e);
  }
};

async function newProjectUser(projectId: string, user: IUser) {
  await setDoc(
    doc(dbm, "projects", projectId, "accessList", user.uid),
    {
      uid: user.uid,
      displayName: user.displayName,
      projectId: projectId,
      timestamp: serverTimestamp(),
    },
    { merge: true },
  );

  // Sync allowedUsers
  const projectRef = doc(dbm, "projects", projectId);
  await updateDoc(projectRef, {
    allowedUsers: arrayUnion(user.uid),
  });
  await updateDoc(projectRef, {
    allowedUsers: arrayUnion(auth.currentUser?.uid),
  });
}

async function createUser(user: IUser) {
  const fsi2 = await fetchSignInMethodsForEmail(auth, user.email);

  let user2 = null;
  if (fsi2.length === 0) {
    user2 = await createUserWithEmailAndPassword(auth, user.email, "password");
  } else {
    user2 = await signInWithEmailAndPassword(auth, user.email, "password");
  }

  await setDoc(doc(dbm, "users", user2.user.uid), user, { merge: true });

  return user2.user.uid;
}
