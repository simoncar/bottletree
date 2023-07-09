import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Button as NativeButton,
    useColorScheme,
    Pressable,
    Switch,
} from "react-native";

import { Text, TextInput, View } from "../components/Themed";
import { addCalendarEvent, updateCalendarEvent } from "../lib/APIcalendar";
import { useProject } from "../lib/projectProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Colors from "../constants/Colors";
import { ICalendarEvent } from "../lib/types";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "../lib/authProvider";

export default function editPost() {
    const { sharedDataProject } = useProject();
    const { sharedDataUser } = useAuth();
    const { calendarId } = useLocalSearchParams();

    const [title, onChangeTitle] = useState();
    const [description, onChangeDescription] = useState();

    const [allDay, setAllDay] = useState(true);

    const [dateBegin, setDateBegin] = useState(new Date());
    const [dateBeginTime, setDateBeginTime] = useState(new Date());
    const [dateEnd, setDateEnd] = useState(new Date());
    const [dateEndTime, setDateEndTime] = useState(new Date());

    const colorScheme = useColorScheme();
    const router = useRouter();

    const saveDone = (id: string) => {
        console.log("saveDone: " + id);

        router.replace({
            pathname: "/calendar",
            params: {},
        });
    };

    const save = () => {
        const d1 = new Date(dateBegin);
        const d2 = new Date(dateEnd);

        if (allDay) {
            d1.setHours(0, 0, 0, 0);
            d2.setHours(0, 0, 0, 0);
        } else {
            d1.setHours(
                dateBeginTime.getHours(),
                dateBeginTime.getMinutes(),
                0,
                0,
            );
            d2.setHours(dateEndTime.getHours(), dateEndTime.getMinutes(), 0, 0);
        }

        const calendarEvent: ICalendarEvent = {
            allDay: allDay,
            dateBegin: Timestamp.fromDate(d1),
            dateEnd: Timestamp.fromDate(d2),
            description: description || "",
            title: title || "",
            projectId: sharedDataProject.key,
            uid: sharedDataUser.uid,
        };

        addCalendarEvent(calendarEvent, saveDone);
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

    const toggleAllDaySwitch = () =>
        setAllDay((previousState) => !previousState);

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
                    />
                </View>
            </View>

            <View style={styles.itemView}>
                <View style={styles.avatar}>
                    <Feather
                        name="clock"
                        size={25}
                        color={Colors[colorScheme ?? "light"].text}
                    />
                </View>
                <View style={styles.title}>
                    <Text style={styles.normalText}>All-day</Text>
                </View>
                <View style={styles.right}>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={allDay ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleAllDaySwitch}
                        value={allDay}
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
                {!allDay && (
                    <View style={styles.right}>
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={dateBeginTime}
                            mode={"time"}
                            is24Hour={true}
                            onChange={onChangeBeginTime}
                        />
                    </View>
                )}
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
                {!allDay && (
                    <View style={styles.right}>
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={dateEndTime}
                            mode={"time"}
                            is24Hour={true}
                            onChange={onChangeEndTime}
                        />
                    </View>
                )}
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

            <Pressable style={styles.itemView} onPress={() => save()}>
                <View style={styles.avatar}>
                    <Ionicons
                        name="save-outline"
                        size={25}
                        color={Colors[colorScheme ?? "light"].text}
                    />
                </View>
                <View>
                    <Text style={styles.actionTitle}>Save</Text>
                </View>
            </Pressable>

            <Pressable
                style={styles.itemView}
                onPress={() => {
                    console.log("delete");
                }}>
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
    normalText: {
        fontSize: 16,
    },
    right: { paddingRight: 8 },
    title: { flex: 1, justifyContent: "flex-start" },
    titleText: {
        fontSize: 20,
    },
});
