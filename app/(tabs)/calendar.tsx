import React, { useContext, useEffect, useState } from "react";
import {
    Alert,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    SafeAreaView,
} from "react-native";
import {
    Agenda,
    DateData,
    AgendaEntry,
    AgendaSchedule,
} from "react-native-calendars";
import { getItems } from "../../lib/APIcalendar";
import { IProject } from "../../lib/types";
import Project from "../../components/ProjectPanel";
import { View, Text, useThemeColor } from "../../components/Themed";
import Feather from "@expo/vector-icons/Feather";
import ProjectContext from "../../lib/projectContext";
import Colors from "../../constants/Colors";

export default function Calendar() {
    const [items, setItems] = useState({});
    const { sharedDataProject } = useContext(ProjectContext);
    const colorScheme = useColorScheme();

    let currentProject: IProject = sharedDataProject;

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
            const unsubscribe = getItems(currentProject.key, itemsRead);
            return () => {
                unsubscribe;
            };
        }
    }, []);

    const renderItem = (reservation: any, isFirst: boolean) => {
        let colorPanel = Colors[colorScheme ?? "light"].calendarPanelAllDay;

        if (!reservation.allDay) {
            colorPanel = Colors[colorScheme ?? "light"].calendarPanelPartDay;
        }

        return (
            <TouchableOpacity
                style={[
                    styles.item,
                    {
                        height: reservation.height,
                        backgroundColor: colorPanel,
                    },
                ]}
                onPress={() => Alert.alert(reservation.title)}>
                <Text
                    style={[
                        styles.title,
                        {
                            color: Colors[colorScheme ?? "light"].calendarTitle,
                        },
                    ]}>
                    {reservation.title}
                </Text>
                <Text style={styles.description}>
                    {reservation.description}
                </Text>
                {!reservation.allDay && (
                    <View
                        style={[
                            styles.time,
                            {
                                height: reservation.height,
                                backgroundColor:
                                    Colors[colorScheme ?? "light"]
                                        .calendarPanel,
                            },
                        ]}>
                        <Feather
                            name="clock"
                            size={25}
                            color={Colors[colorScheme ?? "light"].text}
                        />
                        <Text style={styles.timeText}>
                            {reservation.timeBegin} - {reservation.timeEnd}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const renderEmptyDate = () => {
        return (
            <View style={styles.emptyDate}>
                <Text>This is empty date!</Text>
            </View>
        );
    };

    const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
        return r1.name !== r2.name;
    };

    const timeToString = (time: number) => {
        const date = new Date(time);
        return date.toISOString().split("T")[0];
    };

    const reservationsKeyExtractor = (item, index) => {
        return `${item?.reservation?.day}${index}`;
    };

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View>
                <Project
                    project={currentProject.key}
                    title={currentProject.title}
                    icon={currentProject.icon}
                />
            </View>
            <Agenda
                items={items}
                // loadItemsForMonth={loadItems()}
                renderItem={renderItem}
                rowHasChanged={rowHasChanged}
                showClosingKnob={true}
                theme={{
                    calendarBackground:
                        Colors[colorScheme ?? "light"].background,
                    dotColor: Colors[colorScheme ?? "light"].text,
                    monthTextColor: Colors[colorScheme ?? "light"].text,
                    agendaDayNumColor: Colors[colorScheme ?? "light"].text,
                    agendaTodayColor: Colors[colorScheme ?? "light"].text,
                    agendaKnobColor: "grey",
                    dayTextColor: "#2d4150",
                    textDisabledColor: "#2d4150",
                    textMonthFontWeight: "bold",
                    //@ts-ignore
                    "stylesheet.agenda.main": {
                        reservations: {
                            flex: 1,
                            marginTop: 100,
                        },
                    },
                }}
                disabledByDefault
                hideExtraDays={false}
                reservationsKeyExtractor={reservationsKeyExtractor}
                onDayPress={(day: DateData) => {
                    console.log("day pressed", day);
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    description: {
        paddingTop: 10,
    },
    emptyDate: {
        flex: 1,
        height: 15,
        paddingTop: 30,
    },
    item: {
        borderRadius: 8,
        flex: 1,
        margin: 8,
        padding: 10,
    },

    safeAreaView: {
        flex: 1,
    },
    time: {
        paddingTop: 10,
        alignItems: "center",
        flexDirection: "row",
        verticalAlign: "middle",
    },
    timeText: { paddingLeft: 10 },

    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
});
