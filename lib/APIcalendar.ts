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
                dd: doc.data().dateBegin.toDate().toISOString().split("T")[0],
                ee: doc.data().dateEnd.toDate().toISOString().split("T")[0],
            });
        });

        console.log("Calendar Events BEFORE: ", calendarEvents);
        const expandedDates = expandDateRanges(calendarEvents);
        console.log("Calendar Events AFTER: ", expandedDates);

        callback(expandedDates);
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
    dateBegin: string;
    dateEnd: string;
}

interface ExpandedDates {
    [date: string]: string;
}

function expandDateRanges(dateRanges: DateRange[]): ExpandedDates {
    const expandedDates: ExpandedDates = {};

    for (const range of dateRanges) {
        const startDate = new Date(range.dd);
        const endDate = new Date(range.ee);

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateString = currentDate.toISOString().split("T")[0];
            expandedDates[dateString] = [
                ...(expandedDates[dateString] || []),
                {
                    title: range.title,
                    name: range.title,
                    description: range.description,
                    projectId: range.projectId,
                    key: range.key,
                    dateBegin: range.dateBegin,
                    dateEnd: range.dateEnd,
                    allDay: range.allDay,
                    uid: range.uid,
                },
            ];

            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    return expandedDates;
}

const dateRanges: DateRange[] = [
    {
        start: "2023-07-01",
        end: "2023-07-05",
    },
    {
        start: "2023-07-08",
        end: "2023-07-10",
    },
];

const expandedDates = expandDateRanges(dateRanges);
console.log(expandedDates);

// interface DateRange {
//     dateBegin: string;
//     dateEnd: string;
// }

// interface ExpandedDates {
//     [date: string]: string;
// }

// function expandDateRanges(dateRanges: DateRange[]): ExpandedDates {
//     const expandedDates: ExpandedDates = {};
//     console.log("dateRanges:", dateRanges);

//     for (const range of dateRanges) {
//         console.log("aaa:", range.start, range.end);

//         const startDate = new Date(range.start);
//         const endDate = new Date(range.end);

//         const currentDate = new Date(startDate);
//         while (currentDate <= endDate) {
//             const dateString = currentDate.toISOString().split("T")[0];
//             expandedDates[dateString] = range.start + "-" + range.end;

//             currentDate.setDate(currentDate.getDate() + 1);
//         }
//     }

//     return expandedDates;
// }

// const dateRanges: DateRange[] = [
//     {
//         dateBegin: "2023-07-01",
//         dateEnd: "2023-07-05",
//     },
//     {
//         dateBegin: "2023-07-08",
//         dateEnd: "2023-07-10",
//     },
// ];

// const expandedDates = expandDateRanges(dateRanges);
// console.log(expandedDates);
