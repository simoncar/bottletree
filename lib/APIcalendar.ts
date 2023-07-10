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
            });
        });

        console.log("Calendar Events read: ", calendarEvents);

        callback(calendarEvents);
    });

    return () => unsubscribe();
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
            console.log("Calendar Event written with ID: ", docRef.id);
            callback(docRef.id);
        });
    } catch (e) {
        console.error("Error adding calendar event: ", e);
    }

    return;
}

interface DateRange {
    start: string;
    end: string;
}

interface ExpandedDates {
    [date: string]: string;
}

function expandDateRanges(
    dateRanges: Record<string, DateRange>,
): ExpandedDates {
    const expandedDates: ExpandedDates = {};

    for (const key in dateRanges) {
        if (dateRanges.hasOwnProperty(key)) {
            const range = dateRanges[key];
            const startDate = new Date(range.start);
            const endDate = new Date(range.end);

            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                const dateString = currentDate.toISOString().split("T")[0];
                expandedDates[dateString] = key;

                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
    }

    return expandedDates;
}

const dateRanges: Record<string, DateRange> = {
    range1: {
        start: "2023-07-01",
        end: "2023-07-05",
    },
    range2: {
        start: "2023-07-08",
        end: "2023-07-10",
    },
};

const expandedDates = expandDateRanges(dateRanges);
console.log(expandedDates);
