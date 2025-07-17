import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from "@react-native-firebase/firestore";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { ColorRow } from "@/components/ColorRow";
import { Text, TextInput, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import {
  deleteCalendarEvent,
  getCalendarEvent,
  saveCalendarEvent,
} from "@/lib/APIcalendar";
import { getProject } from "@/lib/APIproject";
import { ICalendarEvent, IProject } from "@/lib/types";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import * as Localization from "expo-localization";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { t } from "i18next";

type DisplayMode = "calendar" | "spinner" | "inline" | "compact" | "clock";
type DateorTime = "date" | "time";

type CalendarParams = {
  calendarId: string;
  project: string;
  clickDate?: string;
};
export default function editCalendar() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const { calendarId, project, clickDate } =
    useLocalSearchParams<CalendarParams>();
  const [calendarEvent, setCalendarEvent] = useState<ICalendarEvent>({
    key: "",
    color: "#30A7E2",
    colorName: "Blue",
    description: "",
    projectId: "",
    title: "",
    uid: "",
  });
  const [projectObj, setProject] = useState<IProject>({
    project: "",
    key: "",
    title: "",
    icon: "",
    archived: false,
    postCount: 0,
    private: false,
  });

  const [dateBegin, setDateBegin] = useState<Date>(new Date());
  const [dateBeginTime, setDateBeginTime] = useState<Date>(new Date());
  const [dateEnd, setDateEnd] = useState<Date>(new Date());
  const [dateEndTime, setDateEndTime] = useState<Date>(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [showColor, setShowColor] = useState<boolean>(false);
  const [datePart, setDatePart] = useState<string>("dateBegin");
  const [dateOrTime, setDateOrTime] = useState<DateorTime>("date");
  const [pickerValue, setPickerValue] = useState<Date>(new Date());
  const [displayMode, setDisplayMode] = useState<DisplayMode>("inline");
  const locale = Localization.getLocales()[0]?.languageCode || "en";

  useEffect(() => {
    if (calendarId != undefined) {
      getCalendarEvent(project, calendarId || "", (calendarEvent) => {
        if (calendarEvent) {
          setCalendarEvent(calendarEvent);
          setDateBegin(calendarEvent.dateBegin?.toDate() || new Date());
          setDateBeginTime(calendarEvent.dateBegin?.toDate() || new Date());
          setDateEnd(calendarEvent.dateEnd?.toDate() || new Date());
          setDateEndTime(calendarEvent.dateEnd?.toDate() || new Date());
        }
      });
    } else {
      const today = new Date();
      const clickDateObj = new Date(clickDate || today);
      clickDateObj.setHours(9, 0, 0, 0);
      setDateBegin(clickDateObj);
      setDateBeginTime(clickDateObj);

      const clickDateEndTime = new Date(clickDate || today);
      clickDateEndTime.setHours(17, 0, 0, 0);
      setDateEnd(clickDateEndTime);
      setDateEndTime(clickDateEndTime);
    }

    getProject(project || "", (projectObj) => {
      if (projectObj) {
        setProject(projectObj);
      }
    });
  }, []);

  const saveDone = (id: string) => {
    router.back();
  };

  const save = () => {
    const d1 = new Date(dateBegin);
    const d2 = new Date(dateEnd);

    d1.setHours(dateBeginTime.getHours(), dateBeginTime.getMinutes(), 0, 0);
    d2.setHours(dateEndTime.getHours(), dateEndTime.getMinutes(), 0, 0);
    saveCalendarEvent(
      project,
      {
        ...calendarEvent,
        dateBegin: Timestamp.fromDate(d1),
        dateEnd: Timestamp.fromDate(d2),
      },
      saveDone,
    );
  };

  const deleteDone = () => {
    router.back();
  };

  const doDelete = () => {
    Alert.alert(
      t("delete"),
      t("areYouSure"),
      [
        {
          text: t("cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("delete"),
          onPress: () => {
            deleteCalendarEvent(project, calendarEvent, deleteDone);
          },
        },
      ],
      { cancelable: false },
    );
  };

  const onChangedateBegin = (selectedDate: Date) => {
    const currentDate = selectedDate || dateBegin;

    setDateBegin(currentDate);
    setCalendarEvent({
      ...calendarEvent,
      dateBegin: Timestamp.fromDate(currentDate),
    });

    if (selectedDate > dateEnd) {
      setDateEnd(currentDate);
      setCalendarEvent({
        ...calendarEvent,
        dateEnd: Timestamp.fromDate(currentDate),
      });
    }
    hideDatePicker();
  };

  const onChangeBeginTime = (selectedDate: Date) => {
    const currentDate = selectedDate || dateBegin;
    setDateBeginTime(currentDate);
  };

  const onChangedateEnd = (selectedDate: Date) => {
    const currentDate = selectedDate || dateEnd;
    setDateEnd(currentDate);
    setCalendarEvent({
      ...calendarEvent,
      dateEnd: Timestamp.fromDate(currentDate),
    });
    if (currentDate < dateBegin) {
      setDateBegin(currentDate);
      setCalendarEvent({
        ...calendarEvent,
        dateBegin: Timestamp.fromDate(currentDate),
      });
    }
  };

  const onChangeEndTime = (selectedDate: Date) => {
    const currentDate = selectedDate || dateEnd;
    setDateEndTime(currentDate);
  };

  const handleSelectColor = (colorName, code) => {
    setCalendarEvent({ ...calendarEvent, colorName: colorName, color: code });
    setShowColor(false);
  };

  const renderDelete = () => {
    if (calendarEvent.key == undefined || calendarEvent.key === "") {
      return null;
    } else {
      return (
        <Pressable style={styles.itemView} onPress={() => doDelete()}>
          <View style={styles.avatar}>
            <Ionicons
              name="trash"
              size={25}
              color={Colors[colorScheme ?? "light"].textPlaceholder}
            />
          </View>
          <View>
            <Text style={styles.actionTitle}>{t("delete")}</Text>
          </View>
        </Pressable>
      );
    }
  };

  const showDatePicker = (dateParttoDisplay, dateorTime, pickerValue) => {
    if (dateorTime == "date") {
      setDisplayMode("inline");
    } else {
      setDisplayMode(null);
    }

    setDateOrTime(dateorTime);
    setPickerValue(pickerValue);
    setDatePart(dateParttoDisplay);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    switch (datePart) {
      case "dateBegin":
        onChangedateBegin(date);
        break;
      case "dateBeginTime":
        onChangeBeginTime(date);
        break;
      case "dateEnd":
        onChangedateEnd(date);
        break;
      case "dateEndTime":
        onChangeEndTime(date);
        break;
    }
  };

  console.log("editCalendar.tsx:", dateBeginTime);
  console.log("Current state of calendarEvent:", calendarEvent);

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPressIn={() => {
                save();
              }}
            >
              <Text>{t("done")}</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView>
        <View style={[styles.itemView, styles.line]}>
          <DateTimePickerModal
            testID="dateTimePicker1"
            date={pickerValue}
            isVisible={isDatePickerVisible}
            mode={dateOrTime}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            display={displayMode}
          />

          <View style={styles.avatar}>
            <Pressable
              onPress={() => {
                console.log("color press:");
                setShowColor(!showColor);
              }}
            >
              <View style={styles.itemView}>
                <View style={styles.avatar}>
                  <View
                    style={[
                      styles.colorAvatar,
                      { backgroundColor: calendarEvent.color },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.line}></View>
            </Pressable>
          </View>
          <View style={styles.title}>
            <TextInput
              style={styles.titleText}
              onChangeText={(text) =>
                setCalendarEvent({ ...calendarEvent, title: text })
              }
              placeholder={t("addTitle")}
              value={calendarEvent.title}
              autoFocus={true}
            />
          </View>
        </View>
        {showColor && (
          <View style={styles.itemViewRow}>
            <ColorRow onPress={handleSelectColor} />
          </View>
        )}

        <View style={styles.itemView}>
          <View style={styles.avatar}></View>
          <View style={styles.date}>
            <View style={{ flexDirection: "row", alignItems: "center" }}></View>
            <Pressable
              onPress={() => showDatePicker("dateBegin", "date", dateBegin)}
            >
              <Text style={styles.textDate}>
                {dateBegin.toLocaleDateString(locale, {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </Pressable>
          </View>
          <View style={styles.right}>
            <Pressable
              onPress={() =>
                showDatePicker("dateBeginTime", "time", dateBeginTime)
              }
            >
              <Text style={styles.textDate}>
                {dateBeginTime.toLocaleString(locale, {
                  hour12: true,
                  timeStyle: "short",
                })}
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.itemView}>
          <View style={styles.avatar}></View>
          <View style={styles.date}>
            <Pressable
              onPress={() => showDatePicker("dateEnd", "date", dateEnd)}
            >
              <Text style={styles.textDate}>
                {dateEnd.toLocaleDateString(locale, {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </Pressable>
          </View>
          <View style={styles.right}>
            <Pressable
              onPress={() => showDatePicker("dateEndTime", "time", dateEndTime)}
            >
              <Text style={styles.textDate}>
                {dateEndTime.toLocaleString(locale, {
                  hour12: true,
                  timeStyle: "short",
                })}
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={[styles.descriptionView, styles.line]}>
          <View style={styles.avatar}>
            <Feather
              name="align-left"
              size={25}
              color={Colors[colorScheme ?? "light"].textPlaceholder}
            />
          </View>
          <TextInput
            style={styles.textDescription}
            onChangeText={(description) =>
              setCalendarEvent({ ...calendarEvent, description: description })
            }
            placeholder={t("addDescription")}
            value={calendarEvent.description}
            multiline
            numberOfLines={6}
            autoCapitalize="none"
          />
        </View>
        <View style={[styles.itemView, styles.line]}>
          <View style={styles.avatar}>
            <Image style={styles.projectAvatar} source={projectObj.icon} />
          </View>
          <View style={styles.title}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.actionTitle}
            >
              {projectObj.title}
            </Text>
          </View>
        </View>

        {renderDelete()}
        <View style={styles.bottom}></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actionTitle: {
    fontSize: 20,
  },
  avatar: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: 48,
    marginRight: 8,
  },
  bottom: { paddingBottom: 500 },
  colorAvatar: {
    borderRadius: 35 / 2,
    height: 35,
    width: 35,
  },
  date: {
    alignItems: "flex-start",
    flex: 1,
    justifyContent: "flex-start",
    width: 50,
  },
  descriptionView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 8,
    padding: 8,
  },

  itemView: {
    alignItems: "center",
    flexDirection: "row",
    height: 80,
    paddingVertical: 8,
    padding: 8,
  },
  itemViewRow: {
    alignItems: "center",
    flexDirection: "row",
    height: 80,
    paddingVertical: 8,
    padding: 8,
  },

  line: {
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  projectAvatar: { borderRadius: 35 / 2, height: 35, width: 35 },
  right: { paddingRight: 8 },
  textDate: {
    fontSize: 20,
  },
  textDescription: {
    fontSize: 16,
    width: 350,
  },

  title: { flex: 1, justifyContent: "flex-start" },
  titleText: {
    fontSize: 22,
  },
});
