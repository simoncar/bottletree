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
                icon: "https://",
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
                    "http://127.0.0.1:9199/v0/b/builder-403d5.appspot.com/o/01_View07_NIT.jpg?alt=media&token=12e33333-f59d-4aba-84ee-555c1aedd910",
                ],
            },
            { merge: true },
        );

        const projectRef2 = await setDoc(
            doc(db, "projects", "project22222222"),
            {
                title: "(Local) Placa Rovira",
                icon: "https://",
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
                    "http://127.0.0.1:9199/v0/b/builder-403d5.appspot.com/o/01_View07_NIT.jpg?alt=media&token=12e33333-f59d-4aba-84ee-555c1aedd910",
                    "http://127.0.0.1:9199/v0/b/builder-403d5.appspot.com/o/01_View08.jpg?alt=media&token=f4464847-94ef-40bd-bdca-5f39cd8bffaf",
                    "http://127.0.0.1:9199/v0/b/builder-403d5.appspot.com/o/01_View09.jpg?alt=media&token=0e1c3b21-dfad-47fa-afeb-cbd7ad2e7aa4",
                ],
            },
            { merge: true },
        );

        const postRef3 = await setDoc(
            doc(db, "calendar", "calendar11111111"),
            {
                description: "some description",
                title: "Install the Kitchen",
                dateBegin: Timestamp.fromDate(new Date(2023, 6, 15)),
                dateEnd: Timestamp.fromDate(new Date(2023, 6, 15)),
                uid: "3whGasgLCJbo3NUMt19dE8D6DmV2",
                projectId: "73JwAXeOEhLXUggpVKK9",
            },
            { merge: true },
        );
        const postRef4 = await setDoc(
            doc(db, "calendar", "calendar22222222"),
            {
                description: "some description",
                title: "Paint the walls",
                dateBegin: Timestamp.fromDate(new Date(2023, 6, 15)),
                dateEnd: Timestamp.fromDate(new Date(2023, 6, 17)),
                uid: "3whGasgLCJbo3NUMt19dE8D6DmV2",
                projectId: "73JwAXeOEhLXUggpVKK9",
            },
            { merge: true },
        );
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};
