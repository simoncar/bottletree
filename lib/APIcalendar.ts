import {
    addDoc,
    collection,
    onSnapshot,
    query,
    Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { IProject, ICalendarEvent } from "./types";

type projectsRead = (projects: IProject[]) => void;

export async function getItems(projectId: string, callback: itemsRead) {
    const q = query(collection(db, "calendar"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const calendarEvents: ICalendarEvent[] = [];
        querySnapshot.forEach((doc) => {
            calendarEvents.push({
                key: doc.id,
                allDay: doc.data().allDay,
                dateBegin: doc.data().dateBegin,
                dateEnd: doc.data().dateEnd,
                description: doc.data().description,
                projectId: doc.data().projectId,
                title: doc.data().title,
                uid: doc.data().uid,
                dateBeginSplit: doc
                    .data()
                    .dateBegin.toDate()
                    .toISOString()
                    .split("T")[0],
                dateEndSplit: doc
                    .data()
                    .dateEnd.toDate()
                    .toISOString()
                    .split("T")[0],
                timeBegin: doc
                    .data()
                    .dateBegin.toDate()
                    .toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                timeEnd: doc.data().dateEnd.toDate().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            });
        });

        calendarEvents.push({
            key: "emptyKey",
            allDay: false,
            dateBegin: Timestamp.fromDate(new Date("2023-01-01")),
            dateEnd: Timestamp.fromDate(new Date("2025-01-01")),
            description: "",
            projectId: "",
            title: "",
            uid: "",
            dateBeginSplit: new Date("2023-01-01").toISOString().split("T")[0],
            dateEndSplit: new Date("2025-01-01").toISOString().split("T")[0],
            timeBegin: "00:00",
            timeEnd: "00:00",
        });

        const expandedDates = expandDateRanges(calendarEvents);

        callback(expandedDates);
    });

    return () => unsubscribe();
}

interface DateRange {
    dateBegin: string;
    dateEnd: string;
}

interface ExpandedDates {
    [date: string]: string;
}

function expandDateRanges(dateRanges: DateRange[]): ExpandedDates {
    const expandedDates: ExpandedDates = {};

    for (const range of dateRanges) {
        const startDate = new Date(range.dateBeginSplit);
        const endDate = new Date(range.dateEndSplit);
        let numDays = (endDate.getTime() - startDate.getTime()) / 86400000;

        const currentDate = new Date(startDate);
        let i = 1;

        while (currentDate <= endDate) {
            const dateString = currentDate.toISOString().split("T")[0];
            if (range.key === "emptyKey") {
                expandedDates[dateString] = [
                    ...(expandedDates[dateString] || []),
                ];
            } else {
                expandedDates[dateString] = [
                    ...(expandedDates[dateString] || []),
                    {
                        title: range.title + " (Day " + i + "/" + numDays + ")",
                        description: range.description,
                        projectId: range.projectId,
                        key: range.key,
                        dateBegin: range.dateBegin,
                        dateEnd: range.dateEnd,
                        allDay: range.allDay,
                        uid: range.uid,
                        dateBeginSplit: range.dateBeginSplit,
                        timeBegin: range.timeBegin,
                        timeEnd: range.timeEnd,
                    },
                ];
            }
            i++;

            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    return expandedDates;
}

export function addCalendarEvent(
    calendarEvent: ICalendarEvent,
    callback: { (id: string): void; (arg0: string): void },
) {
    try {
        addDoc(collection(db, "calendar"), {
            allDay: calendarEvent.allDay,
            dateBegin: calendarEvent.dateBegin,
            dateEnd: calendarEvent.dateEnd,
            description: calendarEvent.description,
            projectId: calendarEvent.projectId,
            title: calendarEvent.title,
            uid: calendarEvent.uid,
        }).then((docRef) => {
            callback(docRef.id);
        });
    } catch (e) {
        console.error("Error adding calendar event: ", e);
    }

    return;
}
