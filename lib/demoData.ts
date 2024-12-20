import { db, firestore, auth } from "./firebase";
import { IUser } from "./types";

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
    project: "",
    anonymous: false,
  });

  users.push({
    displayName: "Lloyd Fox",
    email: "lloyd@simon.co",
    pushToken: "ExponentPushToken[en5SSANZy96dpSJ302wi6z]",
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface12.jpeg?alt=media&token=c048eee1-3673-4d5a-b35a-0e3c45a25c69",
    project: "",
    anonymous: false,
  });

  users.push({
    displayName: "Sue Wheeler",
    email: "sue@simon.co",
    pushToken: "void",
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface10.jpeg?alt=media&token=ec4a6ece-d8a6-4d57-b960-622e451f5c18",
    project: "",
    anonymous: false,
  });

  users.push({
    displayName: "Scarlett Hale",
    email: "scarlett@simon.co",
    pushToken: "void",
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface3.jpeg?alt=media&token=dc2bca16-60e3-44d8-8e5b-aaab28ab7dc5",
    project: "",
    anonymous: false,
  });
  users.push({
    displayName: "Louella Barrett",
    email: "louelle@simon.co",
    pushToken: "void",
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface8.jpeg?alt=media&token=706f834e-0e01-47a3-9e54-a1e602a0911d",
    project: "",
    anonymous: false,
  });
  users.push({
    displayName: "Aubree Mendoza",
    email: "aubree@simon.co",
    pushToken: "void",
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface11.jpeg?alt=media&token=2a87c0ba-d4fa-405e-89eb-689e8ca4b05c",
    project: "",
    anonymous: false,
  });
  users.push({
    displayName: "Armando Bradley",
    email: "armando@simon.co",
    pushToken: "void",
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Ffacemale1.jpg?alt=media&token=2fbef981-e857-4e1d-af4b-38c5fbf14512",
    project: "",
    anonymous: false,
  });

  users[0].uid = await createUser(users[0]);
  users[1].uid = await createUser(users[1]);
  users[2].uid = await createUser(users[2]);
  users[3].uid = await createUser(users[3]);
  users[4].uid = await createUser(users[4]);
  users[5].uid = await createUser(users[5]);
  users[6].uid = await createUser(users[6]);

  try {
    await db.collection("projects").doc("project106joli").set(
      {
        title: "Local 106 Jolimont",
        icon: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FwhiteHouse.jpeg?alt=media&token=0e4f6f2d-2840-4fc3-9dac-9e3db41e6eb7",
        archived: false,
        postCount: 109,
        timestamp: firestore.Timestamp.now(),
      },
      { merge: true },
    );

    await db
      .collection("projects")
      .doc("project106joli")
      .collection("posts")
      .doc("post1111111")
      .set(
        {
          author: "John Doe",
          avatar: "https://",
          timestamp: firestore.Timestamp.now(),

          images: [
            "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/posts%2F202307%2F36442255-2444-4043-AFA8-57E171FC0559?alt=media&token=ff922597-1dec-4822-abd0-83750e40a865",
          ],
        },
        { merge: true },
      );

    await db.collection("projects").doc("project7rovira").set(
      {
        title: "Local Placa Rovira",
        icon: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FroviraSmall.jpg?alt=media&token=a9d67e04-7bef-475b-88f8-4a1f35117ddc",
        archived: false,
        postCount: 7,
        timestamp: firestore.Timestamp.now(),
      },
      { merge: true },
    );

    await db
      .collection("projects")
      .doc("project7rovira")
      .collection("posts")
      .doc("post2222222")
      .set(
        {
          author: "John Doe",
          avatar: "https://",
          timestamp: firestore.Timestamp.now(),
          images: [
            "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/posts%2F202307%2F199D1629-236B-4A78-B2C6-D1C0A1689E8B?alt=media&token=a16d1ecc-dd20-4b99-a077-5cbb446d2a05",
            "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Froof%2FScreenshot%202023-05-30%20at%202.05.53%20PM.png?alt=media&token=b776cb08-fc7e-4ac6-b01b-e2ff47920c76&_gl=1*cz9bbf*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODQzMy4wLjAuMA..",
            "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Froof%2FScreenshot%202023-05-30%20at%202.05.58%20PM.png?alt=media&token=35645c96-05d4-4ffc-95e4-0b805ae91981&_gl=1*1aa7ivb*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODQzOS4wLjAuMA..",
          ],
        },
        { merge: true },
      );

    await db
      .collection("projects")
      .doc("project7rovira")
      .collection("files")
      .doc("file11111")
      .set(
        {
          key: "file1111",
          filename: "House Plans version 1",
          url: "https://file.location/filename.txt",
          created: firestore.Timestamp.now(),
          modified: firestore.Timestamp.now(),
          mimeType: "application/pdf",
          bytes: 5242880,
          projectId: "project7rovira",
        },
        { merge: true },
      );

    await db
      .collection("projects")
      .doc("project7rovira")
      .collection("files")
      .doc("file2222")
      .set(
        {
          key: "file1111",
          filename: "Bathroom Plans",
          url: "https://file.location/filename.txt",
          created: firestore.Timestamp.now(),
          modified: firestore.Timestamp.now(),
          mimeType: "application/pdf",
          bytes: 6242880,
          projectId: "project7rovira",
        },
        { merge: true },
      );
    await db
      .collection("projects")
      .doc("project7rovira")
      .collection("files")
      .doc("file3333")
      .set(
        {
          key: "file1111",
          filename: "Certificate of Occupancy",
          url: "https://file.location/filename.txt",
          created: firestore.Timestamp.now(),
          modified: firestore.Timestamp.now(),
          mimeType: "application/pdf",
          bytes: 6242880,
          projectId: "project7rovira",
        },
        { merge: true },
      );

    await db.collection("projects").doc("welcome").set(
      {
        title: "Welcome Project",
        icon: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FroviraSmall.jpg?alt=media&token=a9d67e04-7bef-475b-88f8-4a1f35117ddc",
        archived: false,
        postCount: 7,
        timestamp: firestore.Timestamp.now(),
      },
      { merge: true },
    );

    await db
      .collection("projects")
      .doc("welcome")
      .collection("posts")
      .doc("welcomePost")
      .set(
        {
          author: "John Doe",
          avatar: "https://",
          timestamp: firestore.Timestamp.now(),
          images: [
            "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/posts%2F202307%2F199D1629-236B-4A78-B2C6-D1C0A1689E8B?alt=media&token=a16d1ecc-dd20-4b99-a077-5cbb446d2a05",
            "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Froof%2FScreenshot%202023-05-30%20at%202.05.53%20PM.png?alt=media&token=b776cb08-fc7e-4ac6-b01b-e2ff47920c76&_gl=1*cz9bbf*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODQzMy4wLjAuMA..",
            "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Froof%2FScreenshot%202023-05-30%20at%202.05.58%20PM.png?alt=media&token=35645c96-05d4-4ffc-95e4-0b805ae91981&_gl=1*1aa7ivb*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODQzOS4wLjAuMA..",
          ],
        },
        { merge: true },
      );

    await newProjectUser("project7rovira", users[0]);
    await newProjectUser("project7rovira", users[1]);
    await newProjectUser("project7rovira", users[2]);
    await newProjectUser("project7rovira", users[5]);

    await newProjectUser("welcome", users[0]);
    await newProjectUser("welcome", users[1]);
    await newProjectUser("welcome", users[2]);
    await newProjectUser("welcome", users[5]);

    await newProjectUser("project106joli", users[0]);
    await newProjectUser("project106joli", users[1]);
    await newProjectUser("project106joli", users[2]);
    await newProjectUser("project106joli", users[3]);
    await newProjectUser("project106joli", users[4]);
    await newProjectUser("project106joli", users[5]);

    await db.collection("tokens").doc("vtgZnrL-rx5viXmTI19u0u").set(
      {
        displayName: "Demo User",
        pushToken: "ExponentPushToken[vtgZnrL-rx5viXmTI19u0u]",
        timestamp: firestore.Timestamp.now(),
        uid: users[0].uid,
      },
      { merge: true },
    );
    await db.collection("tokens").doc("z-50OyGeRPth6nxZSWk_A4").set(
      {
        displayName: "Demo User iPad",
        pushToken: "ExponentPushToken[z-50OyGeRPth6nxZSWk_A4]",
        timestamp: firestore.Timestamp.now(),
        uid: users[0].uid,
      },
      { merge: true },
    );

    await db
      .collection("calendar")
      .doc("calendar22222222")
      .set(
        {
          description:
            "A. Here is the details of the installer https://kitchen.com or give them a call",
          title: "Install the Kitchen",
          dateBegin: firestore.Timestamp.fromDate(new Date()),
          dateEnd: firestore.Timestamp.fromDate(new Date()),
          uid: "3whGasgLCJbo3NUMt19dE8D6DmV2",
          projectId: "project7rovira",
        },
        { merge: true },
      );

    const date = new Date();
    date.setDate(date.getDate() + 3);
    date.setMinutes(50);
    date.setHours(16);

    await db
      .collection("calendar")
      .doc("calendar22222222")
      .set(
        {
          description:
            "B. Will use quality paint from Bunnings color code Cool Grey (#8D99AE)",
          title: "Paint the walls",
          dateBegin: firestore.Timestamp.fromDate(new Date()),
          dateEnd: firestore.Timestamp.fromDate(date),
          uid: "3whGasgLCJbo3NUMt19dE8D6DmV2",
          projectId: "project106joli",
        },
        { merge: true },
      );
  } catch (e) {
    console.error("Error adding document: ", e);
  }

  async function newProjectUser(projectId: string, user: IUser) {
    return await db
      .collection("projects")
      .doc(projectId)
      .collection("accessList")
      .doc(user.uid)
      .set(
        {
          uid: user.uid,
          displayName: user.displayName,
          projectId: projectId,
          timestamp: firestore.Timestamp.now(),
        },
        { merge: true },
      );
  }

  async function createUser(user: IUser) {
    const fsi2 = await auth().fetchSignInMethodsForEmail(user.email);

    let user2 = null;
    if (fsi2.length === 0) {
      user2 = await auth().createUserWithEmailAndPassword(
        user.email,
        "password",
      );
    } else {
      user2 = await auth().signInWithEmailAndPassword(user.email, "password");
    }

    await db.collection("users").doc(user2.user.uid).set(user, { merge: true });

    return user2.user.uid;
  }
};
