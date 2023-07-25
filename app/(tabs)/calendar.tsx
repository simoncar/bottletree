import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { Agenda, DateData, AgendaEntry } from "react-native-calendars";
import { getItems } from "../../lib/APIcalendar";
import { IProject } from "../../lib/types";
import Project from "../../components/ProjectPanel";
import { View, Text, ParsedText } from "../../components/Themed";
import ProjectContext from "../../lib/projectContext";
import Colors from "../../constants/Colors";
import { router } from "expo-router";

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

    const renderTime = (reservation: any) => {
        let time = "";

        if (reservation.extensionNumDays == 1) {
            time =
                reservation.extensionTimeBegin +
                " - " +
                reservation.extensionTimeEnd;
        } else {
            if (reservation.extensionDay == 1) {
                time = reservation.extensionTimeBegin;
            } else if (
                reservation.extensionDay == reservation.extensionNumDays
            ) {
                time = "Ends " + reservation.extensionTimeEnd;
            } else {
                time = "All day";
            }
        }
        return <Text style={styles.timeText}>{time}</Text>;
    };

    const renderLocation = (reservation: any) => {
        let location = "";

        if (reservation.extensionNumDays == 1) {
            time =
                reservation.extensionTimeBegin +
                " - " +
                reservation.extensionTimeEnd;
        } else {
            if (reservation.extensionDay == 1) {
                time = reservation.extensionTimeBegin;
            } else if (
                reservation.extensionDay == reservation.extensionNumDays
            ) {
                time = "Ends " + reservation.extensionTimeEnd;
            } else {
                time = "All day";
            }
        }
        return <Text style={styles.timeText}>{time}</Text>;
    };

    const renderItem = (reservation: any, isFirst: boolean) => {
        const colorPanel = Colors[colorScheme ?? "light"].calendarPanel;

        return (
            <TouchableOpacity
                style={[
                    styles.item,
                    {
                        height: reservation.height,
                        backgroundColor: colorPanel,
                    },
                ]}
                onPress={() => {
                    router.push({
                        pathname: "/editCalendar",
                        params: {
                            pkey: reservation.key,
                            ptitle: reservation.title,
                            pdescription: reservation.description,
                            pdateBegin: reservation.dateBegin.toDate(),
                            pdateEnd: reservation.dateEnd.toDate(),
                            puid: reservation.uid,
                        },
                    });
                }}>
                <Text
                    style={[
                        styles.title,
                        {
                            color: Colors[colorScheme ?? "light"].calendarTitle,
                        },
                    ]}>
                    {reservation.extensionTitle}
                </Text>
                <ParsedText
                    style={styles.description}
                    text={reservation.description}
                    selectable
                />

                {renderTime(reservation)}
                {renderLocation(reservation)}
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
        <View style={styles.list}>
            <View>
                <Project
                    project={currentProject.key}
                    title={currentProject.title}
                    icon={currentProject.icon}
                    page="calendar"
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
                    dayTextColor:
                        Colors[colorScheme ?? "light"].calendarDayTextColor,
                    textDisabledColor:
                        Colors[colorScheme ?? "light"].textDisabledColor,
                    textMonthFontWeight: "bold",
                    "stylesheet.agenda.main": {
                        reservations: {
                            flex: 1,
                            marginTop: 100,
                        },
                    },
                    "stylesheet.day.basic": {
                        base: {
                            width: 40,
                            height: 40,
                            alignItems: "center",
                            alignSelf: "center",
                            justifyContent: "center",
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
                onDayChange={(day) => {
                    console.log("day changed", day);
                }}
                renderEmptyDate={renderEmptyDate}
            />
        </View>
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
    list: {
        flex: 1,
        paddingTop: 4,
        padding: 10,
        width: "100%",
    },

    timeText: { paddingTop: 5 },

    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
});
