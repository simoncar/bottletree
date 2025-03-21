/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { getItemsBigCalendar } from "@/lib/APIcalendar";
import { demoDataForDemoProject } from "@/lib/demoProject";
import { CustomCalendarEvent } from "@/lib/types";
import { FontAwesome5 } from "@expo/vector-icons";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/es";
import * as Localization from "expo-localization";
import {
  router,
  Stack,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { Calendar } from "react-native-big-calendar";

import { MonthYearScroller } from "@/components/Months";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";

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
  const { t } = useTranslation();

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
      },
    },
    eventCellOverlappings: "#d0c161",
  };

  const itemsRead = (calendarItemsDB) => {
    setItems(calendarItemsDB);
  };

  useEffect(() => {
    //if the project = 'demo' then update demo data
    demoDataForDemoProject();

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

  const onPressCell = (date: Date) => {
    console.log("onPressCell", date);
    //alert("onPressCell");
    router.navigate({
      pathname: "/editCalendar",
      params: {
        project: project,
        clickDate: date.toISOString(),
      },
    });
  };

  const onPressDateHeader = (date: Date) => {
    console.log("onPressDateHeader", date);
    //alert("onPressDateHeader");
    router.navigate({
      pathname: "/editCalendar",
      params: {
        project: project,
        clickDate: date.toISOString(),
      },
    });
  };

  return (
    <ScrollView>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPressIn={() => {
                  router.push({
                    pathname: "/calendarSync",
                    params: { project: project },
                  });
                }}
                style={{ paddingRight: 10 }}>
                <FontAwesome5
                  name="sync-alt"
                  size={16}
                  color={Colors[colorScheme ?? "light"].text}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPressIn={() => {
                  goToday();
                }}>
                <Text style={{ paddingRight: 5 }}>{t("today")}</Text>
              </TouchableOpacity>
            </View>
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
        onPressCell={onPressCell}
        onPressDateHeader={onPressDateHeader}
        eventMinHeightForMonthView={25}
        maxVisibleEventCount={10}
        swipeEnabled={false}
        locale={Localization.getLocales()[0]?.languageCode || "en"}
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
    fontSize: 12,
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
