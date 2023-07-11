import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
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
                    .toLocaleTimeString("en-US"),
                timeEnd: doc
                    .data()
                    .dateEnd.toDate()
                    .toLocaleTimeString("en-US"),
            });
        });

        const expandedDates = expandDateRanges(calendarEvents);
        console.log("expandedDates", expandedDates);

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

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateString = currentDate.toISOString().split("T")[0];
            expandedDates[dateString] = [
                ...(expandedDates[dateString] || []),
                {
                    title: range.title,
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
