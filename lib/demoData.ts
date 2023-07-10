import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export const demoData = async () => {
    //console.log("Skip demo data");
};

export const demoData2 = async () => {
    try {
        const projectRef1 = await addDoc(collection(db, "projects"), {
            title: "(Local) 106 Jolimont",
            icon: "https://",
            archived: false,
        });

        console.log("Document written with ID: ", projectRef1.id);

        const postRef1 = await addDoc(
            collection(db, "projects", projectRef1.id, "posts"),
            {
                author: "John Doe",
                avatar: "https://",
                timestamp: Timestamp.now(),
                images: [
                    "http://127.0.0.1:9199/v0/b/builder-403d5.appspot.com/o/profilePic.jpeg?alt=media&token=e71be59c-587d-4018-889f-7a81d2e440d3",
                ],
            },
        );

        console.log("Document written with ID: ", postRef1.id);

        const projectRef2 = await addDoc(collection(db, "projects"), {
            title: "(Local) Placa Rovira",
            icon: "https://",
        });

        console.log("Document written with ID: ", projectRef2.id);

        const postRef2 = await addDoc(
            collection(db, "projects", projectRef2.id, "posts"),
            {
                author: "John Doe",
                avatar: "https://",
                timestamp: Timestamp.now(),
                images: [
                    "http://127.0.0.1:9199/v0/b/builder-403d5.appspot.com/o/rovira.jpg?alt=media&token=abceec3f-7a1c-4208-8233-59955e407d9b",
                ],
            },
        );

        console.log("Document written with ID: ", postRef2.id);

        const postRef3 = await addDoc(collection(db, "calendar"), {
            allDay: true,
            description: "some description",
            title: "some title",
            dateBegin: Timestamp.fromDate(new Date(2023, 7, 15)),
            dateEnd: Timestamp.fromDate(new Date(2023, 7, 15)),
            uid: "3whGasgLCJbo3NUMt19dE8D6DmV2",
            projectId: "73JwAXeOEhLXUggpVKK9",
        });
        const postRef4 = await addDoc(collection(db, "calendar"), {
            allDay: true,
            description: "some description",
            title: "some title",
            dateBegin: Timestamp.fromDate(new Date(2023, 7, 10)),
            dateEnd: Timestamp.fromDate(new Date(2023, 7, 14)),
            uid: "3whGasgLCJbo3NUMt19dE8D6DmV2",
            projectId: "73JwAXeOEhLXUggpVKK9",
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};
