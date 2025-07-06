import { ButtonYellow } from "@/components/Button";
import { dbm } from "@/lib/firebase";
import { ICalendarEvent } from "@/lib/types";
import { collection, doc, getDocs } from "@react-native-firebase/firestore";
import * as Calendar from "expo-calendar";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

type SyncParams = {
  project: string;
};

export default function CalendarSync() {
  const { project } = useLocalSearchParams<SyncParams>();
  const [errorMessage, setErrorMessage] = React.useState("");

  async function getDefaultCalendarSource() {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    return defaultCalendar.source;
  }

  async function syncWithDeviceCalendar(
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
      //   const q = firestore()
      //     .collection("projects")
      //     .doc(project)
      //     .collection("calendar");

      const calendarCollectionRef = collection(
        doc(collection(dbm, "projects"), project),
        "calendar",
      );

      console.log("syncWithDeviceCalendar (modular)");

      const querySnapshot = await getDocs(calendarCollectionRef);
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
        new Date(new Date().setDate(new Date().getDate() - 100)),
        new Date(new Date().setDate(new Date().getDate() + 100)),
      );

      // Sync events: Add, update, or delete as necessary
      const firestoreEventMap = new Map(firestoreEvents.map((e) => [e.key, e]));
      const expoEventMap = new Map(expoEvents.map((e) => [e.id, e]));

      // Add or update events
      for (const event of firestoreEvents) {
        const matchingEvent = Array.from(expoEventMap.values()).find(
          (e) => e.notes === "OneBuildID:" + project + "/" + event.key,
        );

        if (matchingEvent) {
          // Update event if necessary
          if (
            matchingEvent.notes ==
            "OneBuildID:" + project + "/" + event.key
          ) {
            console.log("matchingEvent:", event.title, event.key);

            await Calendar.updateEventAsync(matchingEvent.id, {
              title: event.title,
              startDate: event.dateBegin.toDate().toISOString(), // Ensure proper date format
              endDate: event.dateEnd.toDate().toISOString(), // Ensure proper date format
              notes: "OneBuildID:" + project + "/" + event.key,
            });
          }
        } else {
          // Add new event
          console.log("createEvent:", event.title, event.key);
          await Calendar.createEventAsync(calendarId, {
            title: event.title,
            startDate: event.dateBegin.toDate().toISOString(), // Ensure proper date format
            endDate: event.dateEnd.toDate().toISOString(), // Ensure proper date format
            notes: "OneBuildID:" + project + "/" + event.key,
          });
        }
      }

      // Delete events that are no longer in Firestore
      for (const event of expoEvents) {
        if (event.notes?.startsWith("OneBuildID:" + project + "/")) {
          const eventKey = event.notes?.split("/")[1];
          if (eventKey && !firestoreEventMap.has(eventKey)) {
            console.log("Delete Event:", event.title, event.notes);
            await Calendar.deleteEventAsync(event.id);
          }
        }
      }
      setErrorMessage("Calendar synced successfully");
      callback("Calendar synced successfully");
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Error syncing calendar:", error);
      callback("Error syncing calendar");
    }
  }

  function handleSync() {
    syncWithDeviceCalendar(project, (message) => {
      console.log(message);
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Calendar Sync Screen</Text>
      <Text style={styles.text}>(experimental)</Text>
      <ButtonYellow onPress={handleSync} label={"Sync Calendar"} />
      <Text style={styles.text}>{errorMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },
});
