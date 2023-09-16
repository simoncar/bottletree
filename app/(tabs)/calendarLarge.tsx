import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Pressable,
  Dimensions,
} from "react-native";
import { getItemsBigCalendar } from "../../lib/APIcalendar";
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
import { ScrollView } from "react-native-gesture-handler";

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
      moreLabel: Colors[colorScheme ?? "light"].text,
      nowIndicator: "#d06184",
      gray: {
        "100": "#333",
        "200": Colors[colorScheme ?? "light"].bigCalendarBoxes, //boxes around days
        "300": "#888",
        "500": "#aaa",
        "800": Colors[colorScheme ?? "light"].bigCalendarDayNumberInactive, // day nuumber
      },
    },
    typography: {
      moreLabel: {
        fontSize: 10,
        fontWeight: "normal",
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
      icon: "",
    };
  }

  useEffect(() => {
    console.log("useEffect setNavOptions:", calendarDate);

    setNavOptions(calendarDate);
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

  const setNavOptions = (start) => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ width: 50, height: 50, paddingTop: 3 }}>
            <Pressable onPress={_onPrevDate}>
              <FontAwesome5
                name="chevron-left"
                size={23}
                color={Colors[colorScheme ?? "light"].text}
              />
            </Pressable>
          </View>

          <View style={{ width: 40, height: 50, paddingTop: 3 }}>
            <Pressable onPress={_onNextDate}>
              <FontAwesome5
                name="chevron-right"
                size={23}
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
              {dayjs(start.toDate()).format("MMMM YYYY")}
            </BigText>
          </View>
        </View>
      ),
    });
  };

  const onChangeDate = ([start, end]) => {
    console.log("onChangeDate:", start, end);
    setDate(start);
    setNavOptions(dayjs(start));
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

  const onPressEvent = (event: ICalendarEventBase) => {
    console.log("onPressEvent:", event);
    router.push({
      pathname: "/editCalendar",
      params: {
        pkey: event.key,
        ptitle: event.title,
        pdescription: event.description,
        pdateBegin: event.start,
        pdateEnd: event.end,
        puid: event.uid,
        pcolor: event.color,
        pcolorName: event.colorName,
      },
    });
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

  return (
    <ScrollView>
      <Calendar
        events={items}
        height={height - 200}
        mode="month"
        swipeEnabled={true}
        renderEvent={renderEvent}
        theme={darkTheme}
        eventCellStyle={styles.calendarCellStyle}
        date={calendarDate}
        onChangeDate={onChangeDate}
        onPressEvent={onPressEvent}
        eventMinHeightForMonthView={25}
        maxVisibleEventCount={3}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    paddingTop: 3,
  },
  calendarEvent: {
    padding: 3,
  },
  calendarEventText: {
    color: "white",
  },
  calendarCellStyle: {
    borderWidth: 0,
    color: "white",
    padding: 0,
  },

  rightChevron: {
    marginHorizontal: 8,
  },
});
