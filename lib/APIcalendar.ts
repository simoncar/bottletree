import {
  addDoc,
  collection,
  onSnapshot,
  query,
  Timestamp,
  setDoc,
  doc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { ICalendarEvent } from "./types";
import firestore from "@react-native-firebase/firestore";

type itemsRead = (calendarEvents: ICalendarEvent[]) => void;

const translateColor = (color: string) => {
  if (color === undefined || color === "") {
    return "#30A7E2";
  } else {
    return color;
  }
};
export async function getItemsBigCalendar(
  projectId: string,
  callback: itemsRead,
) {
  const q = firestore().collection("calendar");

  const unsubscribe = q.onSnapshot((querySnapshot) => {
    const calendarEvents: ICalendarEvent[] = [];

    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        //console.log("New event: ", change.doc.data());
      }
      if (change.type === "modified") {
        //console.log("Modified event: ", change.doc.data());
      }
      if (change.type === "removed") {
        //console.log("Removed event: ", change.doc.data());
      }
    });

    querySnapshot.forEach((doc) => {
      const data = {
        key: doc.id,
        start: doc.data().dateBegin.toDate(),
        end: doc.data().dateEnd.toDate(),
        title: doc.data().title,
        color: translateColor(doc.data().color),
        colorName: doc.data().colorName,
        description: doc.data().description,
        projectId: doc.data().projectId,
        uid: doc.data().uid,
      };

      calendarEvents.push(data);
    });

    callback(calendarEvents);
  });

  return () => unsubscribe();
}

export async function getItems(projectId: string, callback: itemsRead) {
  console.log("getItems: FBJS");

  const q = query(
    collection(db, "calendar"),
    where("projectId", "==", projectId),
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const calendarEvents: ICalendarEvent[] = [];
    querySnapshot.forEach((doc) => {
      const data = {
        key: doc.id,
        dateBegin: doc.data().dateBegin,
        dateEnd: doc.data().dateEnd,
        color: doc.data().color,
        description: doc.data().description,
        projectId: doc.data().projectId,
        title: doc.data().title,
        uid: doc.data().uid,
        extensionDateBeginSplit: doc
          .data()
          .dateBegin.toDate()
          .toISOString()
          .split("T")[0],
        extensionDateEndSplit: doc
          .data()
          .dateEnd.toDate()
          .toISOString()
          .split("T")[0],
        extensionTimeBegin: doc
          .data()
          .dateBegin.toDate()
          .toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        extensionTimeEnd: doc.data().dateEnd.toDate().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      calendarEvents.push(data);
    });

    calendarEvents.push({
      key: "emptyKey",
      dateBegin: Timestamp.fromDate(new Date("2023-01-01")),
      dateEnd: Timestamp.fromDate(new Date("2025-01-01")),
      description: "",
      projectId: "",
      title: "",
      uid: "",
      extensionDateBeginSplit: new Date("2023-01-01")
        .toISOString()
        .split("T")[0],
      extensionDateEndSplit: new Date("2025-01-01").toISOString().split("T")[0],
      extensionTimeBegin: "00:00",
      extensionTimeEnd: "00:00",
    });

    const expandedDates = expandDateRanges(calendarEvents);

    callback(expandedDates);
  });

  return () => unsubscribe();
}

interface ExpandedDates {
  [date: string]: string;
}

function expandDateRanges(dateRanges: ICalendarEvent[]): ExpandedDates {
  const expandedDates: ExpandedDates = {};

  for (const range of dateRanges) {
    const startDate = new Date(range.extensionDateBeginSplit);
    const endDate = new Date(range.extensionDateEndSplit);
    const numDays = (endDate.getTime() - startDate.getTime()) / 86400000 + 1;

    const currentDate = new Date(startDate);
    let i = 1;

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split("T")[0];

      let extensionTitle = range.title;

      if (range.key === "emptyKey") {
        expandedDates[dateString] = [...(expandedDates[dateString] || [])];
      } else {
        if (numDays > 1) {
          extensionTitle = range.title + " (Day " + i + "/" + numDays + ")";
        }
        expandedDates[dateString] = [
          ...(expandedDates[dateString] || []),
          {
            title: range.title,
            description: range.description,
            projectId: range.projectId,
            key: range.key,
            dateBegin: range.dateBegin,
            dateEnd: range.dateEnd,
            uid: range.uid,
            extensionTitle: extensionTitle,
            extensionDateBeginSplit: range.extensionDateBeginSplit,
            extensionDateEndSplit: range.extensionDateEndSplit,
            extensionTimeBegin: range.extensionTimeBegin,
            extensionTimeEnd: range.extensionTimeEnd,
            extensionDay: i,
            extensionNumDays: numDays,
          },
        ];
      }
      i++;

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return expandedDates;
}

export function setCalendarEvent(
  calendarEvent: ICalendarEvent,
  callback: { (id: string): void; (arg0: string): void },
) {
  try {
    console.log("setCalendarEvent FBJS");

    if (calendarEvent.key == undefined) {
      addDoc(collection(db, "calendar"), {
        dateBegin: calendarEvent.dateBegin,
        dateEnd: calendarEvent.dateEnd,
        description: calendarEvent.description,
        projectId: calendarEvent.projectId,
        title: calendarEvent.title,
        uid: calendarEvent.uid,
        color: calendarEvent.color,
        colorName: calendarEvent.colorName,
      }).then((docRef) => {
        callback(docRef.id);
      });
    } else {
      setDoc(doc(db, "calendar", calendarEvent.key), {
        dateBegin: calendarEvent.dateBegin,
        dateEnd: calendarEvent.dateEnd,
        description: calendarEvent.description,
        projectId: calendarEvent.projectId,
        title: calendarEvent.title,
        uid: calendarEvent.uid,
        color: calendarEvent.color,
        colorName: calendarEvent.colorName,
      }).then((docRef) => {
        callback(calendarEvent.key);
      });
    }
  } catch (e) {
    console.error("Error adding calendar event: ", e);
  }

  return;
}

export function deleteCalendarEvent(
  calendarEvent: ICalendarEvent,
  callback: deleteDone,
) {
  console.log("deleteCalendarEvent: FBJS");

  const calRef = doc(db, "calendar", calendarEvent.key);
  deleteDoc(calRef).then(() => {
    callback(calendarEvent.key);
  });
}
