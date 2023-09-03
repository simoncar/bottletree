import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Pressable,
  Dimensions,
} from "react-native";
import { Agenda, DateData, AgendaEntry } from "react-native-calendars";
import { getItems, getItemsBigCalendar } from "../../lib/APIcalendar";
import { IProject } from "../../lib/types";
import Project from "../../components/ProjectPanel";
import { View, Text, ParsedText } from "../../components/Themed";
import ProjectContext from "../../lib/projectContext";
import Colors from "../../constants/Colors";
import { router } from "expo-router";
import dayjs from "dayjs";
import { useNavigation } from "expo-router";
import { BigText } from "../../components/StyledText";

import {
  Calendar,
  ICalendarEventBase,
  CalendarTouchableOpacityProps,
} from "react-native-big-calendar";

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

export default function CalendarLarge() {
  const [items, setItems] = useState([]);
  const [calendarDate, setDate] = useState(dayjs());
  const { sharedDataProject } = useContext(ProjectContext);
  const colorScheme = useColorScheme();
  const { width, height } = Dimensions.get("window");
  const navigation = useNavigation();

  let currentProject: IProject = sharedDataProject;

  const itemsRead = (calendarItemsDB) => {
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

  const onChangeDate = ([start, end]) => {
    navigation.setOptions({
      headerTitle: () => (
        <BigText style={styles.headerTitle}>
          {dayjs(start).format("MMMM")}
        </BigText>
      ),
    });
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

  return (
    <View>
      <Text>Header</Text>
      <Pressable
        onPress={() => {
          navigation.setOptions({
            headerTitle: () => (
              <BigText style={styles.headerTitle}>
                {calendarDate.format("MMMM")}
              </BigText>
            ),
          });
          setDate(calendarDate.add(6, "week")), [calendarDate];
        }}>
        <View>
          <Text>DO IT</Text>
        </View>
      </Pressable>
      <Calendar
        events={items}
        height={height - 150}
        mode="month"
        showTime={true}
        showAdjacentMonths={true}
        swipeEnabled={true}
        renderEvent={renderEvent}
        theme={darkTheme}
        eventCellStyle={styles.calendarCellStyle}
        date={calendarDate.toDate()}
        onChangeDate={onChangeDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  calendarCellStyle: {
    borderWidth: 0,
    color: "white",
    padding: 0,
  },
  headerTitle: {
    fontSize: 28,
  },
});
