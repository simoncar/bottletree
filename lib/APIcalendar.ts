import {
  addDoc,
  collection,
  deleteDoc,
  doc, // For Firestore server timestamps
  FirestoreError,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp, // Import Timestamp for type checking and creation
} from "@react-native-firebase/firestore";
import * as Calendar from "expo-calendar";
import { Platform } from "react-native";
import { dbm } from "./firebase"; // Assuming 'db' is your modular Firestore instance
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
  const ref = collection(doc(collection(dbm, "projects"), project), "calendar");
  console.log("getItemsBigCalendar (modular)");

  const unsubscribe = onSnapshot(
    ref,
    (querySnapshot) => {
      // Type for querySnapshot is inferred
      const calendarEvents: ICalendarEvent[] = [];

      querySnapshot.docChanges().forEach((change) => {
        // Type for change is inferred
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

      querySnapshot.forEach((documentSnapshot) => {
        const eventData = documentSnapshot.data();
        const startDate =
          eventData.dateBegin instanceof Timestamp
            ? eventData.dateBegin.toDate()
            : new Date();
        const endDate =
          eventData.dateEnd instanceof Timestamp
            ? eventData.dateEnd.toDate()
            : new Date();

        const data: ICalendarEvent = {
          key: documentSnapshot.id,
          start: startDate,
          end: endDate,
          title: eventData.title,
          color: translateColor(eventData.color),
          colorName: eventData.colorName,
          description: eventData.description,
          projectId: eventData.projectId,
          uid: eventData.uid,
        };

        calendarEvents.push(data);
      });

      callback(calendarEvents);
    },
    (error: FirestoreError) => {
      console.error(
        "Error in getItemsBigCalendar onSnapshot listener: ",
        error,
      );
      callback([]); // Call with empty array on error
    },
  );

  return () => unsubscribe();
}

// export method to get 1 item from the calendar collection based on the key
export async function getCalendarEvent(
  project: string,
  calendarId: string,
  callback: (calendarEvent: ICalendarEvent | null) => void, // Allow null if not found
) {
  const calendarDocRef = doc(dbm, "projects", project, "calendar", calendarId);

  try {
    const docSnap = await getDoc(calendarDocRef);
    if (docSnap.exists()) {
      const eventData = docSnap.data();
      const calendarEvent: ICalendarEvent = {
        key: docSnap.id,
        // Assuming dateBegin and dateEnd are stored as Firestore Timestamps
        dateBegin: eventData.dateBegin,
        dateEnd: eventData.dateEnd,
        color: eventData.color,
        colorName: eventData.colorName,
        description: eventData.description,
        projectId: eventData.projectId,
        title: eventData.title,
        uid: eventData.uid,
      };
      callback(calendarEvent);
    } else {
      console.log("No such calendarId:", calendarId);
      callback(null);
    }
  } catch (error) {
    console.error("Error getting calendar event: ", error);
    callback(null);
  }
}

export async function saveCalendarEvent(
  project: string,
  calendarEvent: ICalendarEvent,
  callback: (id: string | null) => void, // Allow null on error
) {
  try {
    console.log("save CalendarEvent Modular", project, calendarEvent);
    const projectCalendarCollectionRef = collection(
      dbm,
      "projects",
      project,
      "calendar",
    );

    const dataToSave = {
      // Convert Date objects back to Firestore Timestamps if they are not already
      dateBegin: calendarEvent.dateBegin,
      dateEnd: calendarEvent.dateEnd,
      description: calendarEvent.description,
      projectId: project,
      title: calendarEvent.title,
      uid: calendarEvent.uid,
      color: calendarEvent.color ? calendarEvent.color : "#30A7E2",
      colorName: calendarEvent.colorName ? calendarEvent.colorName : "Blue",
      timestamp: serverTimestamp(), // Use serverTimestamp for consistency
    };

    if (calendarEvent.key == undefined) {
      const docRef = await addDoc(projectCalendarCollectionRef, dataToSave);
      callback(docRef.id);
    } else {
      const eventDocRef = doc(projectCalendarCollectionRef, calendarEvent.key);
      await setDoc(eventDocRef, dataToSave);
      callback(calendarEvent.key);
    }
  } catch (e) {
    console.error("Error adding/updating calendar event: ", e);
    callback(null);
  }
}

type deleteDone = (id: string | null) => void; // Allow null on error or if key is missing

export async function deleteCalendarEvent(
  project: string,
  calendarEvent: ICalendarEvent,
  callback: deleteDone,
) {
  if (!calendarEvent.key) {
    console.error("Cannot delete event without a key");
    callback(null);
    return;
  }
  const calRef = doc(dbm, "projects", project, "calendar", calendarEvent.key);
  try {
    await deleteDoc(calRef);
    callback(calendarEvent.key);
  } catch (error) {
    console.error("Error deleting calendar event: ", error);
    callback(null);
  }
}

async function getDefaultCalendarSource(): Promise<
  Calendar.Source | { isLocalAccount: boolean; name: string; type?: string }
> {
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT,
  );
  const defaultCalendar =
    calendars.find((cal) => cal.isPrimary) || calendars[0];
  if (defaultCalendar?.source) {
    return defaultCalendar.source;
  }
  // Fallback for Android if source is not readily available or for a more generic approach
  return {
    isLocalAccount: true,
    name: "One Build",
    type: Platform.OS === "ios" ? Calendar.SourceType.LOCAL : undefined,
  };
}

export async function syncWithDeviceCalendar(
  project: string,
  callback: (message: string) => void,
) {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      callback("Permission to access calendar was denied");
      return;
    }

    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT,
    );
    let calendarId = calendars.find((cal) => cal.title === "One Buid")?.id;

    if (!calendarId) {
      const defaultSource = await getDefaultCalendarSource();
      const calendarDetails: Calendar.CalendarCreateParams = {
        title: "One Buid",
        color: "#F9D96B",
        entityType: Calendar.EntityTypes.EVENT,
        name: "One Buid Calendar",
        ownerAccount: "local",
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      };

      if (
        Platform.OS === "ios" &&
        defaultSource.type === Calendar.SourceType.LOCAL
      ) {
        calendarDetails.sourceId = defaultSource.id;
      } else if (Platform.OS === "android") {
        // For Android, sourceId is not always required or might need specific handling
        // If defaultSource has an id, use it, otherwise Expo might handle it.
        if ("id" in defaultSource && defaultSource.id) {
          calendarDetails.sourceId = defaultSource.id;
        } else {
          // For local accounts on Android, name and type might be sufficient
          // or Expo handles source creation implicitly.
          // Ensure `name` in `defaultSource` is what you expect for the source.
          calendarDetails.source = defaultSource as Calendar.Source; // Cast if confident about structure
        }
      }
      if (
        !calendarDetails.source &&
        !calendarDetails.sourceId &&
        Platform.OS === "ios"
      ) {
        // Fallback for iOS if sourceId couldn't be determined but is required
        const localSources = await Calendar.getSourcesAsync();
        const localSource = localSources.find(
          (s) =>
            s.type === Calendar.SourceType.LOCAL ||
            s.type === Calendar.SourceType.BIRTHDAYS,
        ); // Birthdays often a local source
        if (localSource) calendarDetails.sourceId = localSource.id;
        else {
          console.warn(
            "Could not find a local source for iOS calendar creation.",
          );
          // Potentially fallback to creating without explicit sourceId if API allows
        }
      }

      calendarId = await Calendar.createCalendarAsync(calendarDetails);
    }

    const projectCalendarCollectionRef = collection(
      dbm,
      "projects",
      project,
      "calendar",
    );
    const querySnapshot = await getDocs(projectCalendarCollectionRef); // Changed from q.get()
    const firestoreEvents: ICalendarEvent[] = [];
    querySnapshot.forEach((docSnap) => {
      const eventData = docSnap.data();
      firestoreEvents.push({
        key: docSnap.id,
        dateBegin: eventData.dateBegin,
        dateEnd: eventData.dateEnd,
        title: eventData.title,
        description: eventData.description,
        color: eventData.color,
        uid: eventData.uid,
      });
    });

    if (!calendarId) {
      callback("Failed to get or create a device calendar ID.");
      return;
    }
    const expoEvents = await Calendar.getEventsAsync(
      [calendarId],
      new Date("1970-01-01T00:00:00.000Z"),
      new Date("9999-12-31T23:59:59.999Z"),
    );

    const firestoreEventMap = new Map(firestoreEvents.map((e) => [e.key, e]));

    for (const event of firestoreEvents) {
      const matchingEvent = expoEvents.find((e) => e.notes === event.key);

      const eventDetails: Partial<Calendar.Event> = {
        title: event.title,
        startDate: event.dateBegin, // expo-calendar expects Date objects
        endDate: event.dateEnd, // expo-calendar expects Date objects
        notes: event.key,
      };

      if (matchingEvent) {
        if (matchingEvent.notes === event.key) {
          // Ensure it's the correct event to update
          await Calendar.updateEventAsync(matchingEvent.id!, eventDetails); // Add ! for id as it should exist
        }
      } else {
        if (calendarId)
          await Calendar.createEventAsync(
            calendarId,
            eventDetails as Calendar.Event,
          ); // Cast as Event, ensure all required fields are present
      }
    }

    for (const expoEvent of expoEvents) {
      if (expoEvent.notes && !firestoreEventMap.has(expoEvent.notes)) {
        await Calendar.deleteEventAsync(expoEvent.id!);
      }
    }

    callback("Calendar synced successfully");
  } catch (error) {
    console.error("Error syncing calendar:", error);
    callback(
      "Error syncing calendar: " +
        (error instanceof Error ? error.message : String(error)),
    );
  }
}
