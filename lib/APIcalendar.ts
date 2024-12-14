import { firestore } from "./firebase";
import { ICalendarEvent } from "./types";

type itemsRead = (calendarEvents: ICalendarEvent[]) => void;

const translateColor = (color: string) => {
  if (color === undefined || color === "") {
    return "#30A7E2";
  } else {
    return color;
  }
};
export async function getItemsBigCalendar(
  project: string,
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

// export method to get 1 item from the calendar collection based on the key
export async function getCalendarEvent(
  calendarId: string,
  callback: {
    (calendarEvent: ICalendarEvent): void;
    (arg0: ICalendarEvent): void;
  },
) {
  const q = firestore().collection("calendar").doc(calendarId);

  q.get().then((doc) => {
    if (doc.exists) {
      const calendarEvent: ICalendarEvent = {
        key: doc.id,
        dateBegin: doc.data().dateBegin,
        dateEnd: doc.data().dateEnd,
        color: doc.data().color,
        colorName: doc.data().colorName,
        description: doc.data().description,
        projectId: doc.data().projectId,
        title: doc.data().title,
        uid: doc.data().uid,
      };

      callback(calendarEvent);
    } else {
      console.log("No such calendarId:", calendarId);
    }
  });

  return () => q;
}

export async function getItems(projectId: string, callback: itemsRead) {
  console.log("getItems: FBJS");

  const q = firestore()
    .collection("calendar")
    .where("projectId", "==", projectId);

  const unsubscribe = q.onSnapshot((querySnapshot) => {
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
      dateBegin: firestore.Timestamp.fromDate(new Date("2023-01-01")),
      dateEnd: firestore.Timestamp.fromDate(new Date("2025-01-01")),
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

export function saveCalendarEvent(
  calendarEvent: ICalendarEvent,
  callback: { (id: string): void; (arg0: string): void },
) {
  try {
    console.log("save CalendarEvent FBJS", calendarEvent);

    if (calendarEvent.key == undefined) {
      firestore()
        .collection("calendar")
        .add({
          dateBegin: calendarEvent.dateBegin,
          dateEnd: calendarEvent.dateEnd,
          description: calendarEvent.description,
          projectId: calendarEvent.projectId,
          title: calendarEvent.title,
          uid: calendarEvent.uid,
          color: calendarEvent.color ? calendarEvent.color : "#30A7E2",
          colorName: calendarEvent.colorName ? calendarEvent.colorName : "Blue",
        })
        .then((docRef) => {
          callback(docRef.id);
        });
    } else {
      firestore()
        .collection("calendar")
        .doc(calendarEvent.key)
        .set({
          dateBegin: calendarEvent.dateBegin,
          dateEnd: calendarEvent.dateEnd,
          description: calendarEvent.description,
          projectId: calendarEvent.projectId,
          title: calendarEvent.title,
          uid: calendarEvent.uid,
          color: calendarEvent.color ? calendarEvent.color : "#30A7E2",
          colorName: calendarEvent.colorName ? calendarEvent.colorName : "Blue",
        })
        .then((docRef) => {
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
  const calRef = firestore().collection("calendar").doc(calendarEvent.key);
  calRef.delete().then(() => {
    callback(calendarEvent.key);
  });
}
