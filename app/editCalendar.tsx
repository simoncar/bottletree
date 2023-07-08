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
import { updateProject } from "../lib/APIproject";
import { useProject } from "../lib/projectProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Colors from "../constants/Colors";

export default function editPost() {
    const { sharedData, updateSharedDataProject } = useProject();
    const { calendarId, calendarTitle } = useLocalSearchParams();

    const [title, onChangeTitle] = useState(calendarTitle);
    const [description, onChangeDescription] = useState(calendarTitle);

    const [allDay, setAllDay] = useState(true);

    const [beginDate, setBeginDate] = useState(new Date());
    const [beginTime, setBeginTime] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());

    const colorScheme = useColorScheme();
    const router = useRouter();

    const saveDone = (id: string) => {
        updateSharedDataProject({
            key: id,
            title: text,
            icon: textPhotoURL,
        });

        router.push({
            pathname: "/",
        });
    };

    const save = (downloadURL: string, archived: boolean) => {
        updateProject(
            {
                key: projectId,
                title: text,
                icon: downloadURL,
                archived: archived,
            },
            saveDone,
        );
    };

    const onChangeBeginDate = (
        event: DateTimePickerEvent,
        selectedDate: Date,
    ) => {
        setBeginDate(selectedDate);
        console.log("beginDate: " + selectedDate);
    };
    const onChangeBeginTime = (
        event: DateTimePickerEvent,
        selectedDate: Date,
    ) => {
        setBeginTime(selectedDate);
        console.log("beginTime: " + selectedDate);
    };
    const onChangeEndDate = (
        event: DateTimePickerEvent,
        selectedDate: Date,
    ) => {
        setEndDate(selectedDate);
    };
    const onChangeEndTime = (
        event: DateTimePickerEvent,
        selectedDate: Date,
    ) => {
        setEndTime(selectedDate);
    };

    const toggleAllDaySwitch = () =>
        setAllDay((previousState) => !previousState);

    return (
        <SafeAreaView>
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <NativeButton
                            title="Done"
                            onPress={() => save(textPhotoURL, false)}
                        />
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
                        value={beginDate}
                        mode={"date"}
                        is24Hour={true}
                        onChange={onChangeBeginDate}
                    />
                </View>
                {!allDay && (
                    <View style={styles.right}>
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={beginTime}
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
                        value={endDate}
                        mode={"date"}
                        is24Hour={true}
                        onChange={onChangeEndDate}
                    />
                </View>
                {!allDay && (
                    <View style={styles.right}>
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={endTime}
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

            <Pressable
                style={styles.itemView}
                onPress={() => save(textPhotoURL, true)}>
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
                onPress={() => save(textPhotoURL, true)}>
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
        width: 50,
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
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
