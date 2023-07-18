import { addDoc, doc, collection, Timestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { setBadgeCountAsync } from "expo-notifications";

export const demoData2 = async () => {
    //console.log("Skip demo data");
};

export const demoData = async () => {
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

        const postRef3 = await setDoc(
            doc(db, "calendar", "calendar11111111"),
            {
                description: "some description",
                title: "Install the Kitchen",
                dateBegin: Timestamp.fromDate(new Date()),
                dateEnd: Timestamp.fromDate(new Date()),
                uid: "3whGasgLCJbo3NUMt19dE8D6DmV2",
                projectId: "73JwAXeOEhLXUggpVKK9",
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
                description: "some description",
                title: "Paint the walls",
                dateBegin: Timestamp.fromDate(new Date()),
                dateEnd: Timestamp.fromDate(date),
                uid: "3whGasgLCJbo3NUMt19dE8D6DmV2",
                projectId: "73JwAXeOEhLXUggpVKK9",
            },
            { merge: true },
        );
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};
