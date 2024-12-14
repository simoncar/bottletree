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
  const q = firestore()
    .collection("projects")
    .doc(project)
    .collection("calendar");

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
  project: string,
  calendarId: string,
  callback: {
    (calendarEvent: ICalendarEvent): void;
    (arg0: ICalendarEvent): void;
  },
) {
  const q = firestore()
    .collection("projects")
    .doc(project)
    .collection("calendar")
    .doc(calendarId);

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

export function saveCalendarEvent(
  project: string,
  calendarEvent: ICalendarEvent,
  callback: { (id: string): void; (arg0: string): void },
) {
  try {
    console.log("save CalendarEvent FBJS", project, calendarEvent);

    if (calendarEvent.key == undefined) {
      firestore()
        .collection("projects")
        .doc(project)
        .collection("calendar")
        .add({
          dateBegin: calendarEvent.dateBegin,
          dateEnd: calendarEvent.dateEnd,
          description: calendarEvent.description,
          projectId: project,
          title: calendarEvent.title,
          uid: calendarEvent.uid,
          color: calendarEvent.color ? calendarEvent.color : "#30A7E2",
          colorName: calendarEvent.colorName ? calendarEvent.colorName : "Blue",
          timestamp: firestore.Timestamp.now(),
        })
        .then((docRef) => {
          callback(docRef.id);
        });
    } else {
      firestore()
        .collection("projects")
        .doc(project)
        .collection("calendar")
        .doc(calendarEvent.key)
        .set({
          dateBegin: calendarEvent.dateBegin,
          dateEnd: calendarEvent.dateEnd,
          description: calendarEvent.description,
          projectId: project,
          title: calendarEvent.title,
          uid: calendarEvent.uid,
          color: calendarEvent.color ? calendarEvent.color : "#30A7E2",
          colorName: calendarEvent.colorName ? calendarEvent.colorName : "Blue",
          timestamp: firestore.Timestamp.now(),
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
  project: string,
  calendarEvent: ICalendarEvent,
  callback: deleteDone,
) {
  const calRef = firestore()
    .collection("projects")
    .doc(project)
    .collection("calendar")
    .doc(calendarEvent.key);
  calRef.delete().then(() => {
    callback(calendarEvent.key);
  });
}
