import { Stack, useLocalSearchParams, router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Button as NativeButton,
    useColorScheme,
    Pressable,
    Alert,
} from "react-native";

import { Text, TextInput, View } from "../components/Themed";
import { setCalendarEvent, deleteCalendarEvent } from "../lib/APIcalendar";
import { useProject } from "../lib/projectProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Colors from "../constants/Colors";
import { ICalendarEvent } from "../lib/types";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "../lib/authProvider";
import { Image } from "expo-image";

export default function editCalendar() {
    const { sharedDataProject } = useProject();
    const { sharedDataUser } = useAuth();
    const { pkey, ptitle, pdescription, pdateBegin, pdateEnd, puid } =
        useLocalSearchParams<{
            pkey: string;
            ptitle: string;
            pdescription: string;
            pdateBegin: string;
            pdateEnd: string;
            puid: string;
        }>();

    const [title, onChangeTitle] = useState(ptitle);
    const [description, onChangeDescription] = useState(pdescription);

    const [dateBegin, setDateBegin] = useState<Date>(new Date(pdateBegin));
    const [dateBeginTime, setDateBeginTime] = useState<Date>(
        new Date(pdateBegin),
    );

    const [dateEnd, setDateEnd] = useState<Date>(new Date(pdateEnd));
    const [dateEndTime, setDateEndTime] = useState<Date>(new Date(pdateEnd));

    const colorScheme = useColorScheme();

    const saveDone = (id: string) => {
        router.push({
            pathname: "/calendar",
        });
    };

    const save = () => {
        const d1 = new Date(dateBegin);
        const d2 = new Date(dateEnd);

        d1.setHours(dateBeginTime.getHours(), dateBeginTime.getMinutes(), 0, 0);
        d2.setHours(dateEndTime.getHours(), dateEndTime.getMinutes(), 0, 0);

        const calendarEvent: ICalendarEvent = {
            key: pkey,
            dateBegin: Timestamp.fromDate(d1),
            dateEnd: Timestamp.fromDate(d2),
            description: description || "",
            title: title || "",
            projectId: sharedDataProject.key,
            uid: sharedDataUser.uid,
        };

        setCalendarEvent(calendarEvent, saveDone);
    };

    const deleteDone = (id: string) => {
        router.push({
            pathname: "/calendar",
        });
    };

    const doDelete = () => {
        const d1 = new Date(dateBegin);
        const d2 = new Date(dateEnd);

        d1.setHours(dateBeginTime.getHours(), dateBeginTime.getMinutes(), 0, 0);
        d2.setHours(dateEndTime.getHours(), dateEndTime.getMinutes(), 0, 0);

        const calendarEvent: ICalendarEvent = {
            key: pkey,
            dateBegin: Timestamp.fromDate(d1),
            dateEnd: Timestamp.fromDate(d2),
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
        console.log("dateBegin: " + selectedDate);
    };
    const onChangeBeginTime = (
        event: DateTimePickerEvent,
        selectedDate: Date,
    ) => {
        setDateBeginTime(selectedDate);
        console.log("beginTime: " + selectedDate);
    };
    const onChangedateEnd = (
        event: DateTimePickerEvent,
        selectedDate: Date,
    ) => {
        setDateEnd(selectedDate);
    };
    const onChangeEndTime = (
        event: DateTimePickerEvent,
        selectedDate: Date,
    ) => {
        setDateEndTime(selectedDate);
    };

    console.log("shareddataproject", sharedDataProject);

    return (
        <SafeAreaView>
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <NativeButton title="Done" onPress={() => save()} />
                    ),
                }}
            />

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
                        testID="dateTimePicker"
                        value={dateBegin}
                        mode={"date"}
                        is24Hour={true}
                        onChange={onChangedateBegin}
                    />
                </View>
                <View style={styles.right}>
                    <DateTimePicker
                        testID="dateTimePicker"
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
                        testID="dateTimePicker"
                        value={dateEnd}
                        mode={"date"}
                        is24Hour={true}
                        onChange={onChangedateEnd}
                    />
                </View>
                <View style={styles.right}>
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={dateEndTime}
                        mode={"time"}
                        is24Hour={true}
                        onChange={onChangeEndTime}
                    />
                </View>
            </View>

            <View style={[styles.itemView, styles.line]}>
                <View style={styles.avatar}></View>
                <View style={styles.title}>
                    <TextInput
                        style={styles.titleText}
                        onChangeText={(description) =>
                            onChangeDescription(description)
                        }
                        placeholder={"Add description"}
                        value={description}
                        multiline
                    />
                </View>
            </View>

            <View style={[styles.itemView, styles.line]}>
                <View style={styles.avatar}>
                    <Image
                        style={styles.projectAvatar}
                        source={sharedDataProject.icon}
                    />
                </View>
                <View style={styles.title}>
                    <Text style={styles.actionTitle}>
                        {sharedDataProject.title}
                    </Text>
                </View>
            </View>

            <Pressable style={styles.itemView} onPress={() => doDelete()}>
                <View style={styles.avatar}>
                    <Ionicons
                        name="trash"
                        size={25}
                        color={Colors[colorScheme ?? "light"].text}
                    />
                </View>
                <View>
                    <Text style={styles.actionTitle}>Delete</Text>
                </View>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    actionTitle: {
        fontSize: 20,
    },
    projectAvatar: { borderRadius: 35 / 2, height: 35, width: 35 },
    avatar: { alignItems: "center", justifyContent: "center", width: 48 },
    date: {
        alignItems: "flex-start",
        flex: 1,
        justifyContent: "flex-start",
        width: 50,
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

    right: { paddingRight: 8 },
    title: { flex: 1, justifyContent: "flex-start" },
    titleText: {
        fontSize: 20,
    },
});
