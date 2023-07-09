import {
    addDoc,
    doc,
    updateDoc,
    collection,
    onSnapshot,
    query,
    Timestamp,
    where,
    getDocs,
    documentId,
    orderBy,
} from "firebase/firestore";
import firebase from "firebase/app";
import { db } from "./firebase";
import { IProject, ICalendarEvent } from "./types";

type projectsRead = (projects: IProject[]) => void;

export async function getItems(callback: itemsRead) {
    const q = query(collection(db, "calendar"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const projects: IProject[] = [];
        querySnapshot.forEach((doc) => {
            projects.push({
                key: doc.id,
                title: doc.data().title,
                icon: doc.data().icon,
                archived: doc.data().archived,
            });
        });
        callback(projects);
    });

    return () => unsubscribe();
}

export function updateCalendarEvent(
    calendarEvent: ICalendarEvent,
    callback: saveDone,
) {
    const ref = doc(db, "calendar", calendarEvent.key);

    updateDoc(ref, {
        calendarEvent,
    }).then(() => {
        callback(docRef.id);
    });
}

export function addCalendarEvent(
    calendarEvent: ICalendarEvent,
    callback: { (id: string): void; (arg0: string): void },
) {
    try {
        addDoc(collection(db, "calendar"), {
            calendarEvent,
        }).then((docRef) => {
            console.log("Calendar Event written with ID: ", docRef.id);
            callback(docRef.id);
        });
    } catch (e) {
        console.error("Error adding calendar event: ", e);
    }

    return;
}
