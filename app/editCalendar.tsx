import {
  Stack,
  useLocalSearchParams,
  useNavigation,
  router,
} from "expo-router";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Button as NativeButton,
  useColorScheme,
  Pressable,
  Alert,
} from "react-native";
import { firestore } from "../lib/firebase";

import { Text, TextInput, View } from "../components/Themed";
import { setCalendarEvent, deleteCalendarEvent } from "../lib/APIcalendar";
import { useProject } from "../lib/projectProvider";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Colors from "../constants/Colors";
import { ICalendarEvent } from "../lib/types";
import { useAuth } from "../lib/authProvider";
import { Image } from "expo-image";
import { ScrollView } from "react-native-gesture-handler";

export default function editCalendar() {
  const { sharedDataProject } = useProject();
  const { sharedDataUser } = useAuth();
  const {
    pkey,
    ptitle,
    pcolor,
    pcolorName,
    pdescription,
    pdateBegin,
    pdateEnd,
    puid,
    xcolor,
    xcolorName,
  } = useLocalSearchParams<{
    pkey: string;
    ptitle: string;
    pcolor: string;
    pcolorName: string;
    pdescription: string;
    pdateBegin: string;
    pdateEnd: string;
    puid: string;
    xcolor: string;
    xcolorName: string;
  }>();

  const [key, onChangeKey] = useState(pkey);
  const [title, onChangeTitle] = useState(ptitle);
  const [description, onChangeDescription] = useState(pdescription);
  const [color, onChangeColor] = useState(pcolor);
  const [colorName, onChangeColorName] = useState(pcolorName);

  const [dateBegin, setDateBegin] = useState<Date>(new Date(pdateBegin));
  const [dateBeginShow, setDateBeginShow] = useState<boolean>(true);

  const [dateBeginTime, setDateBeginTime] = useState<Date>(
    new Date(pdateBegin),
  );

  const [dateEnd, setDateEnd] = useState<Date>(new Date(pdateEnd));
  const [dateEndTime, setDateEndTime] = useState<Date>(new Date(pdateEnd));

  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.addListener("focus", () => {
      console.log("useLocalSearchParams:", useLocalSearchParams);
    });
  }, []);

  useEffect(() => {
    console.log("xcolor:", xcolor);
    if (xcolor != undefined) {
      onChangeColor(xcolor);
      onChangeColorName(xcolorName);
    }
  }, [xcolor]);

  const saveDone = (id: string) => {
    // router.push({
    //   pathname: "/calendarLarge",
    //   params: {
    //     id: id,
    //   },
    // });
  };

  const save = () => {
    const d1 = new Date(dateBegin);
    const d2 = new Date(dateEnd);

    d1.setHours(dateBeginTime.getHours(), dateBeginTime.getMinutes(), 0, 0);
    d2.setHours(dateEndTime.getHours(), dateEndTime.getMinutes(), 0, 0);

    const calendarEvent: ICalendarEvent = {
      key: key,
      dateBegin: firestore.Timestamp.fromDate(d1),
      dateEnd: firestore.Timestamp.fromDate(d2),
      description: description || "",
      title: title || "",
      color: color || "",
      colorName: colorName || "",
      projectId: sharedDataProject.key,
      uid: sharedDataUser.uid,
    };
    console.log("save:", calendarEvent);

    setCalendarEvent(calendarEvent, saveDone);
    router.push({
      pathname: "/calendarLarge",
    });
  };

  const deleteDone = (id: string) => {
    router.push({
      pathname: "/calendarLarge",
    });
  };

  const doDelete = () => {
    const d1 = new Date(dateBegin);
    const d2 = new Date(dateEnd);

    d1.setHours(dateBeginTime.getHours(), dateBeginTime.getMinutes(), 0, 0);
    d2.setHours(dateEndTime.getHours(), dateEndTime.getMinutes(), 0, 0);

    const calendarEvent: ICalendarEvent = {
      key: pkey,
      dateBegin: firestore.Timestamp.fromDate(d1),
      dateEnd: firestore.Timestamp.fromDate(d2),
      description: description || "",
      title: title || "",
      projectId: sharedDataProject.key,
      uid: sharedDataUser.uid,
    };

    Alert.alert(
      "Delete",
      "Are you sure?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteCalendarEvent(calendarEvent, deleteDone);
          },
        },
      ],
      { cancelable: false },
    );
  };

  const onChangedateBegin = (
    event: DateTimePickerEvent,
    selectedDate: Date,
  ) => {
    setDateBegin(selectedDate);

    if (selectedDate > dateEnd) {
      console.log("selectedDate:", selectedDate);

      setDateEnd(selectedDate);
    }

    setDateBeginShow(false);
  };

  const onChangeBeginTime = (
    event: DateTimePickerEvent,
    selectedDate: Date,
  ) => {
    setDateBeginTime(selectedDate);
  };
  const onChangedateEnd = (event: DateTimePickerEvent, selectedDate: Date) => {
    setDateEnd(selectedDate);
    if (selectedDate < dateBegin) {
      setDateBegin(selectedDate);
    }
  };
  const onChangeEndTime = (event: DateTimePickerEvent, selectedDate: Date) => {
    setDateEndTime(selectedDate);
  };

  const renderDelete = () => {
    if (pkey == undefined) {
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
            <Text style={styles.actionTitle}>Delete</Text>
          </View>
        </Pressable>
      );
    }
  };

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerRight: () => (
            <NativeButton title="Done" onPress={() => save()} />
          ),
        }}
      />
      <ScrollView>
        <View style={[styles.itemView, styles.line]}>
          <View style={styles.avatar}></View>
          <View style={styles.title}>
            <TextInput
              style={styles.titleText}
              onChangeText={(title) => onChangeTitle(title)}
              placeholder={"Add title"}
              value={title}
              autoFocus={true}
            />
          </View>
        </View>

        <View style={styles.itemView}>
          <View style={styles.avatar}></View>
          <View style={styles.date}>
            <DateTimePicker
              testID="dateTimePicker1"
              value={dateBegin}
              mode={"date"}
              is24Hour={true}
              onChange={onChangedateBegin}
            />
          </View>
          <View style={styles.right}>
            <DateTimePicker
              testID="dateTimePicker2"
              value={dateBeginTime}
              mode={"time"}
              is24Hour={true}
              onChange={onChangeBeginTime}
            />
          </View>
        </View>

        <View style={styles.itemView}>
          <View style={styles.avatar}></View>
          <View style={styles.date}>
            <DateTimePicker
              testID="dateTimePicker3"
              value={dateEnd}
              mode={"date"}
              is24Hour={true}
              onChange={onChangedateEnd}
            />
          </View>
          <View style={styles.right}>
            <DateTimePicker
              testID="dateTimePicker4"
              value={dateEndTime}
              mode={"time"}
              is24Hour={true}
              onChange={onChangeEndTime}
            />
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
            onChangeText={(description) => onChangeDescription(description)}
            placeholder={"Add description"}
            value={description}
            multiline
            numberOfLines={6}
            autoCapitalize="none"
            textAlignVertical="top"
          />
        </View>

        <View style={[styles.itemView, styles.line]}>
          <View style={styles.avatar}>
            <Image
              style={styles.projectAvatar}
              source={sharedDataProject.icon}
            />
          </View>
          <View style={styles.title}>
            <Text style={styles.actionTitle}>{sharedDataProject.title}</Text>
          </View>
        </View>
        <Pressable
          style={styles.pressableRight}
          onPress={() => {
            router.push({
              pathname: "/colorList",
              params: {
                color: color,
              },
            });
          }}>
          <View style={[styles.itemView, styles.line]}>
            <View style={styles.avatar}>
              <View style={[styles.colorAvatar, { backgroundColor: color }]} />
            </View>
            <View style={styles.title}>
              <Text style={styles.actionTitle}>{colorName}</Text>
            </View>
          </View>

          {renderDelete()}
          <View style={styles.bottom}></View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actionTitle: {
    fontSize: 20,
  },
  avatar: { alignItems: "center", justifyContent: "flex-start", width: 48 },
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

  line: {
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  projectAvatar: { borderRadius: 35 / 2, height: 35, width: 35 },
  right: { paddingRight: 8 },
  textDescription: {
    fontSize: 16,
  },

  title: { flex: 1, justifyContent: "flex-start" },
  titleText: {
    fontSize: 20,
  },
});
