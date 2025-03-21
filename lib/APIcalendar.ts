import * as Calendar from "expo-calendar";
import { Platform } from "react-native";
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

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

export async function syncWithDeviceCalendar(
  project: string,
  callback: (message: string) => void,
) {
  try {
    // Request calendar permissions
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      callback("Permission to access calendar was denied");
      return;
    }

    // Check if the "One Buid" calendar exists, if not, create it
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT,
    );
    let calendarId = calendars.find((cal) => cal.title === "One Buid")?.id;

    if (!calendarId) {
      const defaultCalendarSource =
        Platform.OS === "ios"
          ? await getDefaultCalendarSource()
          : { isLocalAccount: true, name: "One Build" };

      const newCalendarId = await Calendar.createCalendarAsync({
        title: "One Buid",
        color: "#F9D96B",
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: "One Buid",
        ownerAccount: "One Buid",
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });

      calendarId = newCalendarId;
    }

    // Fetch all items from Firestore
    const q = firestore()
      .collection("projects")
      .doc(project)
      .collection("calendar");

    const querySnapshot = await q.get();
    const firestoreEvents: ICalendarEvent[] = [];
    querySnapshot.forEach((doc) => {
      firestoreEvents.push({
        key: doc.id,
        dateBegin: doc.data().dateBegin,
        dateEnd: doc.data().dateEnd,
        title: doc.data().title,
        description: doc.data().description,
        color: doc.data().color,
        uid: doc.data().uid,
      });
    });

    // Fetch all events from the "One Buid" calendar
    const expoEvents = await Calendar.getEventsAsync(
      [calendarId],
      new Date("1970-01-01T00:00:00.000Z"),
      new Date("9999-12-31T23:59:59.999Z"),
    );

    // Sync events: Add, update, or delete as necessary
    const firestoreEventMap = new Map(firestoreEvents.map((e) => [e.key, e]));
    const expoEventMap = new Map(expoEvents.map((e) => [e.id, e]));

    for (const [id, event] of expoEventMap) {
      console.log(
        `Expo Event ID: ${id}, Title: ${event.title}, Notes: ${event.notes}`,
      );
    }
    // Add or update events
    for (const event of firestoreEvents) {
      const matchingEvent = Array.from(expoEventMap.values()).find(
        (e) => e.notes === event.key,
      );
      console.log("Event:", event.title, event.key);
      console.log("matchingEvent S:", event.dateBegin.toDate().toISOString());
      console.log("matchingEvent E:", event.dateEnd.toDate().toISOString());

      if (matchingEvent) {
        // Update event if necessary
        if (matchingEvent.notes == event.key) {
          console.log("matchingEvent:", event.title, event.key);
          await Calendar.updateEventAsync(matchingEvent.id, {
            title: event.title,
            startDate: event.dateBegin.toDate().toISOString(), // Ensure proper date format
            endDate: event.dateEnd.toDate().toISOString(), // Ensure proper date format
            notes: event.key,
          });
        }
      } else {
        // Add new event
        console.log("createEvent:", event.title, event.key);
        await Calendar.createEventAsync(calendarId, {
          title: event.title,
          startDate: event.dateBegin.toDate().toISOString(), // Ensure proper date format
          endDate: event.dateEnd.toDate().toISOString(), // Ensure proper date format
          notes: event.key,
        });
      }
    }

    // Delete events that are no longer in Firestore
    for (const event of expoEvents) {
      if (!firestoreEventMap.has(event.notes)) {
        await Calendar.deleteEventAsync(event.id);
      }
    }

    callback("Calendar synced successfully");
  } catch (error) {
    console.error("Error syncing calendar:", error);
    callback("Error syncing calendar");
  }
}
