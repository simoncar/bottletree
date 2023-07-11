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
        return (
            <TouchableOpacity
                style={[styles.item, { height: reservation.height }]}
                onPress={() => Alert.alert(reservation.title)}>
                <Text style={styles.title}>{reservation.title}</Text>
                <Text style={styles.description}>
                    {reservation.dateBeginSplit}
                    ZZZZZ {reservation.description}
                </Text>
                <Text style={styles.description}>
                    {reservation.timeBegin} - {reservation.timeEnd}
                </Text>
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
        backgroundColor: "green",
        borderRadius: 8,
        flex: 1,
        margin: 8,
        paddingVertical: 24,
        padding: 10,
    },

    safeAreaView: {
        flex: 1,
    },

    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
});
