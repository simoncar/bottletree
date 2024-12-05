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
import { router } from "expo-router";
import dayjs from "dayjs";
import { useNavigation } from "expo-router";
import { BigText } from "@/components/StyledText";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  Calendar,
  ICalendarEventBase,
  CalendarTouchableOpacityProps,
} from "react-native-big-calendar";
import MonthYearPicker from "@/components/MonthYearPicker";

import { ScrollView } from "react-native-gesture-handler";

export default function CalendarLarge() {
  const [items, setItems] = useState([]);
  const [calendarDate, setDate] = useState(dayjs());
  const colorScheme = useColorScheme();
  const { height } = Dimensions.get("window");
  const navigation = useNavigation();

  const [selectedMonth, setSelectedMonth] = useState(0); // January
  const [selectedYear, setSelectedYear] = useState(2024);

  const handleValueChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

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
    setNavOptions();
    const unsubscribe = getItemsBigCalendar("", itemsRead);
    return () => {
      unsubscribe;
    };
  }, []);

  useEffect(() => {
    setNavOptions();
  }, [calendarDate]);

  const setNavOptions = () => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleA}>
          <BigText style={styles.headerTitle}>
            {dayjs(calendarDate).format("MMMM YYYY")}
          </BigText>
          <View style={styles.headerTitle}>
            <Text style={styles.text}>
              Selected: {selectedMonth + 1}/{selectedYear}
            </Text>
            <MonthYearPicker
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onValueChange={handleValueChange}
              minYear={2000}
              maxYear={2030}
            />
          </View>
        </View>
      ),
    });
  };

  const onChangeDate = ([start, end]) => {
    //setDate(start);
    //setNavOptions(start);
  };

  const renderEvent = <T extends ICalendarEventBase>(
    event: T,
    touchableOpacityProps: CalendarTouchableOpacityProps,
  ) => {
    const typedEvent = event as T & { color: string }; // Add type assertion
    return (
      <TouchableOpacity {...touchableOpacityProps}>
        <View
          style={[styles.calendarEvent, { backgroundColor: typedEvent.color }]}>
          <Text style={styles.calendarEventText}>{typedEvent.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onPressEvent = <T extends ICalendarEventBase>(event: T) => {
    const typedEvent = event as T & { key: string }; // Add type assertion
    router.navigate({
      pathname: "/editCalendar",
      params: {
        calendarId: typedEvent.key,
      },
    });
  };

  const _onPrevDate = () => {
    setDate(dayjs(calendarDate).add(dayjs(calendarDate).date() * -1, "day"));
  };

  const _onNextDate = () => {
    setDate(dayjs(calendarDate).add(modeToNum("month", calendarDate), "day"));
  };

  function modeToNum(mode: string, current?: dayjs.Dayjs | Date): number {
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
    color: "white",
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
