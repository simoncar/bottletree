import React, { useContext, useEffect, useState } from "react";
import {
    Alert,
    StyleSheet,
    TouchableOpacity,
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
import { View, Text } from "../../components/Themed";
import ProjectContext from "../../lib/projectContext";

export default function Calendar() {
    const [items, setItems] = useState([]);
    const { sharedDataProject } = useContext(ProjectContext);
    const currentProject: IProject = sharedDataProject;

    const itemsRead = (calendarItemsDB) => {
        setItems(calendarItemsDB);
    };

    useEffect(() => {
        if (undefined != currentProject) {
            const unsubscribe = getItems(currentProject.key, itemsRead);
            return () => {
                unsubscribe;
            };
        }
    }, []);

    const renderItem = (reservation: any, isFirst: boolean) => {
        return (
            <TouchableOpacity
                style={[styles.item, { height: reservation.height }]}
                onPress={() => Alert.alert(reservation.name)}>
                <Text style={styles.description}>{reservation.name}</Text>
                <Text style={styles.description}>
                    {reservation.description}
                </Text>
                <Text style={styles.description}>{reservation.contact}</Text>
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
            <Agenda
                items={{
                    "2023-06-10": [
                        {
                            name: "Build Started",
                            description:
                                "Team will be onsite at 8am to start build",
                        },
                        {
                            name: "Plans Approved",
                            description: "See attached plans for details",
                        },
                    ],
                    "2023-06-11": [
                        {
                            name: "Foundations",
                            description:
                                "Trucks have parking permits for the day",
                        },
                    ],
                    "2023-06-12": [{ name: "Slab" }],
                    "2023-06-13": [{ name: "Walls" }],
                    "2023-06-14": [
                        {
                            name: "Roof",
                            description:
                                "High winds expected, please secure materials",
                        },
                    ],
                    "2023-06-15": [
                        {
                            name: "Deadline Taps Order",
                            description: "Order must be confirmed by 5pm",
                            contact: "Stefanie (555) 555-5555",
                        },
                    ],
                    "2023-06-16": [{ name: "Plumbing" }],
                    "2023-06-17": [{ name: "Doors" }],
                    "2023-06-18": [{ name: "Move In" }],
                }}
                // loadItemsForMonth={loadItems()}
                renderItem={renderItem}
                rowHasChanged={rowHasChanged}
                showClosingKnob={true}
                selected={"2023-06-10"}
                monthFormat={"yyyy"}
                theme={{
                    calendarBackground: "#282828",
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
        borderColor: "#ccc",
        borderRadius: 8,
        borderWidth: 1,
        flex: 1,
        marginRight: 10,
        marginTop: 17,
        marginVertical: 8,
        paddingHorizontal: 20,
        paddingVertical: 24,
        padding: 10,
    },

    safeAreaView: {
        flex: 1,
    },
});
