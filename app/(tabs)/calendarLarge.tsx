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
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import {
  Calendar,
  ICalendarEventBase,
  CalendarTouchableOpacityProps,
} from "react-native-big-calendar";

export default function CalendarLarge() {
  const [items, setItems] = useState([]);
  const [calendarDate, setDate] = useState(dayjs());
  const { sharedDataProject } = useContext(ProjectContext);
  const colorScheme = useColorScheme();
  const { width, height } = Dimensions.get("window");
  const navigation = useNavigation();

  let currentProject: IProject = sharedDataProject;

  const darkTheme = {
    palette: {
      primary: {
        main: "#007bff", //'today' color
        contrastText: Colors[colorScheme ?? "light"].bigCalendarContrastText,
      },
      nowIndicator: "#d06184",
      gray: {
        "100": "#333",
        "200": Colors[colorScheme ?? "light"].bigCalendarBoxes, //boxes around days
        "300": "#888",
        "500": "#aaa",
        "800": Colors[colorScheme ?? "light"].bigCalendarDayNumberInactive, // day nuumber
      },
      typography: {
        fontFamily: "FuturaBold",
        xs: { fontSize: 12 },
        sm: { fontSize: 14 },
        xl: { fontSize: 16 },
      },
    },
    eventCellOverlappings: "#d0c161",
  };

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

  // useEffect(() => {
  //   if (sharedDataProject && undefined != currentProject?.key) {
  //     setItems([]);
  //     const unsubscribe = getItemsBigCalendar(currentProject.key, itemsRead);
  //     return () => {
  //       unsubscribe;
  //     };
  //   }
  // }, [currentProject]);

  const setNavOptions = () => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ width: 50, height: 50 }}>
            <Pressable onPress={_onPrevDate}>
              <FontAwesome5
                name="chevron-left"
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
            </Pressable>
          </View>

          <View style={{ width: 50, height: 50 }}>
            <Pressable onPress={_onNextDate}>
              <FontAwesome5
                name="chevron-right"
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
            </Pressable>
          </View>
          <View
            style={{
              width: "100%",
              height: 50,
            }}>
            <BigText style={styles.headerTitle}>
              {dayjs(calendarDate.toDate()).format("MMMM YYYY")}
            </BigText>
          </View>
        </View>
      ),
    });
  };

  const onChangeDate = ([start, end]) => {
    setNavOptions();
  };

  const renderEvent = <T extends ICalendarEventBase>(
    event: T,
    touchableOpacityProps: CalendarTouchableOpacityProps,
  ) => {
    return (
      <TouchableOpacity {...touchableOpacityProps}>
        <View style={[styles.calendarEvent, { backgroundColor: event.color }]}>
          <Text style={styles.calendarEventText}>{event.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const _onPrevDate = () => {
    setDate(dayjs(calendarDate).add(dayjs(calendarDate).date() * -1, "day"));
  };

  const _onNextDate = () => {
    setDate(dayjs(calendarDate).add(modeToNum("month", calendarDate), "day"));
  };

  function modeToNum(mode: Mode, current?: dayjs.Dayjs | Date): number {
    if (!current) {
      throw new Error("You must specify current date if mode is month");
    }
    if (current instanceof Date) {
      current = dayjs(current);
    }
    return current.daysInMonth() - current.date() + 1;
  }

  setNavOptions();

  return (
    <View>
      <Calendar
        events={items}
        height={height - 70}
        mode="month"
        showTime={true}
        showAdjacentMonths={true}
        swipeEnabled={true}
        renderEvent={renderEvent}
        theme={darkTheme}
        eventCellStyle={styles.calendarCellStyle}
        date={calendarDate}
        onChangeDate={onChangeDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 28,
  },
  calendarEvent: {},
  calendarEventText: {
    color: "white",
  },
  calendarCellStyle: {
    borderWidth: 0,
    color: "white",
    padding: 0,
  },
  headerTitle: {
    fontSize: 28,
  },
  text: {},

  rightChevron: {
    marginHorizontal: 8,
  },
});
