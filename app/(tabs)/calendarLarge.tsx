import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { Agenda, DateData, AgendaEntry } from "react-native-calendars";
import { getItems, getItemsBigCalendar } from "../../lib/APIcalendar";
import { IProject } from "../../lib/types";
import Project from "../../components/ProjectPanel";
import { View, Text, ParsedText } from "../../components/Themed";
import ProjectContext from "../../lib/projectContext";
import Colors from "../../constants/Colors";
import { router } from "expo-router";

import {
  Calendar,
  ICalendarEventBase,
  CalendarTouchableOpacityProps,
} from "react-native-big-calendar";

const events = [
  {
    title: "Meeting",
    start: new Date(2023, 8, 2, 0, 0),
    end: new Date(2023, 8, 5, 0, 0),
    color: "#2f95dc",
  },
  {
    title: "Coffee break",
    start: new Date(2023, 8, 1, 0, 0),
    end: new Date(2023, 8, 15, 0, 0),
    color: "#dc2fbc",
  },
  {
    title: "Build the frame",
    start: new Date(2023, 8, 7, 1, 0),
    end: new Date(2023, 8, 22, 2, 0),
    color: "#2fdc3e",
  },
];

const darkTheme = {
  palette: {
    primary: {
      main: "#6185d0",
      contrastText: "#000",
    },
    gray: {
      "100": "#333",
      "200": "#666",
      "300": "#888",
      "500": "#aaa",
      "800": "#ccc",
    },
  },
  eventCellOverlappings: "#6185d0",
};

const renderEvent = <T extends ICalendarEventBase>(
  event: T,
  touchableOpacityProps: CalendarTouchableOpacityProps,
) => {
  console.log("renderEvent: ", touchableOpacityProps);

  return (
    <TouchableOpacity {...touchableOpacityProps}>
      <View style={[styles.calendarEvent, { backgroundColor: event.color }]}>
        <Text>{event.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function CalendarLarge() {
  const [items, setItems] = useState([]);
  const { sharedDataProject } = useContext(ProjectContext);
  const colorScheme = useColorScheme();

  let currentProject: IProject = sharedDataProject;

  const itemsRead = (calendarItemsDB) => {
    console.log("items read:", calendarItemsDB, events);

    setItems(calendarItemsDB);
  };

  if (null == sharedDataProject) {
    currentProject = {
      key: "",
      title: "",
      icon: "",
    };
  }

  useEffect(() => {
    if (undefined != currentProject) {
      const unsubscribe = getItemsBigCalendar(currentProject.key, itemsRead);
      return () => {
        unsubscribe;
      };
    }
  }, []);

  useEffect(() => {
    if (sharedDataProject && undefined != currentProject?.key) {
      setItems([]);
      const unsubscribe = getItemsBigCalendar(currentProject.key, itemsRead);
      return () => {
        unsubscribe;
      };
    }
  }, [currentProject]);

  const renderTime = (reservation: any) => {
    let time = "";

    if (reservation.extensionNumDays == 1) {
      time =
        reservation.extensionTimeBegin + " - " + reservation.extensionTimeEnd;
    } else {
      if (reservation.extensionDay == 1) {
        time = reservation.extensionTimeBegin;
      } else if (reservation.extensionDay == reservation.extensionNumDays) {
        time = "Ends " + reservation.extensionTimeEnd;
      } else {
        time = "All day";
      }
    }
    return <Text style={styles.timeText}>{time}</Text>;
  };

  const renderItem = (reservation: any, isFirst: boolean) => {
    const colorPanel = Colors[colorScheme ?? "light"].calendarPanel;

    return (
      <TouchableOpacity
        style={[
          styles.item,
          {
            height: reservation.height,
            backgroundColor: colorPanel,
          },
        ]}
        onPress={() => {
          router.push({
            pathname: "/editCalendar",
            params: {
              pkey: reservation.key,
              ptitle: reservation.title,
              pdescription: reservation.description,
              pdateBegin: reservation.dateBegin.toDate(),
              pdateEnd: reservation.dateEnd.toDate(),
              puid: reservation.uid,
            },
          });
        }}>
        <Text
          style={[
            styles.title,
            {
              color: Colors[colorScheme ?? "light"].calendarTitle,
            },
          ]}>
          {reservation.extensionTitle}
        </Text>
        <ParsedText style={styles.description} text={reservation.description} />
        {renderTime(reservation)}
      </TouchableOpacity>
    );
  };

  return (
    <Calendar
      events={items}
      height={600}
      mode="month"
      showTime={true}
      showAdjacentMonths={true}
      swipeEnabled={true}
      renderEvent={renderEvent}
      theme={darkTheme}
      eventCellStyle={styles.calendarCellStyle}
      dayHeaderStyle={styles.calendarDayHeaderStyle}
    />
  );
}

const styles = StyleSheet.create({
  calendarCellStyle: {
    borderWidth: 0,
    color: "white",
    padding: 0,
  },
  calendarDayHeaderStyle: {
    fontSize: 100,
  },
  description: {
    paddingTop: 10,
  },
  emptyDate: {
    flex: 1,
    height: 15,
    paddingTop: 30,
  },
  item: {
    borderRadius: 8,
    flex: 1,
    margin: 8,
    padding: 10,
  },
  list: {
    flex: 1,
    paddingTop: 4,
    padding: 10,
    width: "100%",
  },

  timeText: { paddingTop: 5 },

  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
