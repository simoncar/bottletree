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
import { db, auth } from "./firebase";
import { IUser } from "./types";
import { setBadgeCountAsync } from "expo-notifications";

export const demoData2 = async () => {
  //console.log("Skip demo data");
};

function convertToString(value: string | null): string {
  if (value === null) {
    return "";
  } else {
    return value;
  }
}

export const demoData = async () => {
  console.log("DEMO DATA SEEDING");

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

    const postRef2b = await setDoc(
      doc(
        db,
        "projects",
        "project22222222",
        "users",
        "Ml82nbzqwApMf5ogbB7EN2zll1sn",
      ),
      {
        uid: "uid111111",
        displayName: "Jenny Smith",
        email: "simon@simon.co",
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface10.jpeg?alt=media&token=ec4a6ece-d8a6-4d57-b960-622e451f5c18",
      },
      { merge: true },
    );
    const postRef2c = await setDoc(
      doc(db, "projects", "project22222222", "users", "user222222"),
      {
        uid: "uid22222",
        displayName: "Chris Pater",
        email: "simon@simon.co",
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface12.jpeg?alt=media&token=c048eee1-3673-4d5a-b35a-0e3c45a25c69",
      },
      { merge: true },
    );

    const postRef2d = await setDoc(
      doc(
        db,
        "projects",
        "project11111111",
        "users",
        "Ml82nbzqwApMf5ogbB7EN2zll1sn",
      ),
      {
        uid: "uid111111",
        displayName: "Jenny Smith",
        email: "simon@simon.co",
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface10.jpeg?alt=media&token=ec4a6ece-d8a6-4d57-b960-622e451f5c18",
      },
      { merge: true },
    );
    const postRef2e = await setDoc(
      doc(db, "projects", "project11111111", "users", "user222222"),
      {
        uid: "uid22222",
        displayName: "Chris Pater",
        email: "simon@simon.co",
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface12.jpeg?alt=media&token=c048eee1-3673-4d5a-b35a-0e3c45a25c69",
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

  try {
    const fsi1 = await fetchSignInMethodsForEmail(auth, "simon@simon.co");
    console.log("fsi1:", fsi1);

    let user1 = null;
    if (fsi1.length === 0) {
      user1 = await createUserWithEmailAndPassword(
        auth,
        "simon@simon.co",
        "password",
      );
    } else {
      user1 = await signInWithEmailAndPassword(
        auth,
        "simon@simon.co",
        "password",
      );
    }

    const userD1: IUser = {
      uid: user1.user.uid,
      email: "simon@simon.co",
      displayName: "Simon",
      photoURL: "",
    };

    const userDoc1 = await setDoc(
      doc(db, "users", userD1.uid),
      {
        displayName: userD1.displayName,
        email: userD1.email,
        photoURL: "",
      },
      { merge: true },
    );
  } catch (e) {
    console.log("user1 already exists");
  }

  try {
    const fsi2 = await fetchSignInMethodsForEmail(auth, "test1@simon.co");
    console.log("fsi2:", fsi2);
    let user2 = null;
    if (fsi2.length === 0) {
      user2 = await createUserWithEmailAndPassword(
        auth,
        "test1@simon.co",
        "password",
      );
    } else {
      user2 = await signInWithEmailAndPassword(
        auth,
        "test1@simon.co",
        "password",
      );
    }

    const userD2: IUser = {
      uid: user2.user.uid,
      email: "test1@simon.co",
      displayName: "Timmy One",
      photoURL: "",
    };

    const userDoc2 = await setDoc(
      doc(db, "users", userD2.uid),
      {
        displayName: userD2.displayName,
        email: userD2.email,
        photoURL: "",
      },
      { merge: true },
    );
  } catch (e) {
    console.log("user2 already exists");
  }
  try {
    const fsi3 = await fetchSignInMethodsForEmail(auth, "test2@simon.co");
    console.log("fsi3:", fsi3, fsi3.length);
    let user3 = null;
    if (fsi3.length === 0) {
      user3 = await createUserWithEmailAndPassword(
        auth,
        "test2@simon.co",
        "password",
      );
    } else {
      user3 = await signInWithEmailAndPassword(
        auth,
        "test2@simon.co",
        "password",
      );
      console.log("usesignInWithEmailAndPasswordr3:", user3);
    }

    const userD3: IUser = {
      uid: user3.user.uid,
      email: "test2@simon.co",
      displayName: "Tessy Two",
      photoURL: "",
    };

    const userDoc3 = await setDoc(
      doc(db, "users", userD3.uid),
      {
        displayName: userD3.displayName,
        email: userD3.email,
        photoURL: "",
      },
      { merge: true },
    );
  } catch (e) {
    console.log("user3 already exists:", e);
  }
};
