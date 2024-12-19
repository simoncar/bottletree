/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Pressable,
  Dimensions,
} from "react-native";
import { getItemsBigCalendar } from "@/lib/APIcalendar";
import { View, Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import dayjs from "dayjs";
import { useNavigation, Stack } from "expo-router";
import { useLocalSearchParams, router } from "expo-router";
import { CustomCalendarEvent } from "@/lib/types";

import {
  Calendar,
  ICalendarEventBase,
  CalendarTouchableOpacityProps,
} from "react-native-big-calendar";

import { ScrollView } from "react-native-gesture-handler";
import { MonthYearScroller } from "@/components/Months";

type SearchParams = {
  project: string; //project ID
};

export default function CalendarLarge() {
  const { project } = useLocalSearchParams<SearchParams>();
  const [items, setItems] = useState([]);
  const [calendarDate, setDate] = useState(dayjs());
  const colorScheme = useColorScheme();
  const { height } = Dimensions.get("window");
  const navigation = useNavigation();

  const darkTheme = {
    palette: {
      primary: {
        main: "#007bff",
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

  useEffect(() => {
    const unsubscribe = getItemsBigCalendar(project, itemsRead);
    return () => {
      unsubscribe;
    };
  }, []);

  useEffect(() => {}, [calendarDate]);

  const onChangeDate = ([start, end]) => {
    //setDate(start);
    //setNavOptions(start);
  };

  const onChangeMonth = (monthIndex: number, year: number) => {
    const newDate = dayjs().year(year).month(monthIndex).date(1);
    const today = dayjs();
    if (newDate.isSame(today, "month") && newDate.isSame(today, "year")) {
      setDate(today);
    } else {
      setDate(newDate);
    }
  };

  const goToday = () => {
    setDate(dayjs());
  };

  const renderEvent = <T extends CustomCalendarEvent>(
    event: T,
    touchableOpacityProps: any,
  ) => {
    const typedEvent = event as T & { color: string }; // Add type assertion
    const { key, ...restProps } = touchableOpacityProps;
    return (
      <TouchableOpacity {...restProps}>
        <View
          style={[styles.calendarEvent, { backgroundColor: typedEvent.color }]}>
          <Text style={styles.calendarEventText}>{typedEvent.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onPressEvent = <T extends CustomCalendarEvent>(event: T) => {
    const typedEvent = event as T & { id: string }; // Add type assertion
    console.log("onPressEvent", typedEvent);

    router.navigate({
      pathname: "/editCalendar",
      params: {
        calendarId: typedEvent.key,
        project: project,
      },
    });
  };

  return (
    <ScrollView>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPressIn={() => {
                goToday();
              }}>
              <Text style={{ paddingRight: 5 }}>Today</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <MonthYearScroller
        range={5}
        onSelect={onChangeMonth}
        currentMonthYear={{
          month: calendarDate.month(),
          year: calendarDate.year(),
        }}
      />
      <Calendar
        events={items}
        height={height - 200}
        mode="month"
        renderEvent={renderEvent}
        // @ts-ignore
        theme={darkTheme}
        eventCellStyle={styles.calendarCellStyle}
        // @ts-ignore
        date={calendarDate}
        onChangeDate={onChangeDate}
        onPressEvent={onPressEvent}
        eventMinHeightForMonthView={25}
        maxVisibleEventCount={10}
        swipeEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  calendarCellStyle: {
    borderWidth: 0,
    padding: 0,
  },
  calendarEvent: {
    padding: 3,
  },
  calendarEventText: {
    color: "white",
  },
  headerTitle: {
    fontSize: 24,
  },
  headerTitleA: {
    flexDirection: "row",
  },
  headerTitleB: {},
  headerTitleDate: {},
  pressable: {
    width: 40,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
