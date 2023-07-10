import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, useColorScheme } from "react-native";
import { View, Text, ParsedText } from "./Themed";
import { getProjectUsers } from "../lib/APIproject";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "../lib/authProvider";
import { ShortList } from "../components/sComponent";
import { Image } from "expo-image";

export const ProjectUsers = (props) => {
    const { project } = props;
    const colorScheme = useColorScheme();
    const { sharedDataUser } = useAuth();
    const [projectUsers, setProjectUsers] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProjectUsers(project, projectUsersRead);
    }, []);

    useEffect(() => {
        if (projectUsers !== "" && loading === true) {
            setLoading(false);
        }
    }, [projectUsers]);

    const projectUsersRead = (projectUsersDB) => {
        setProjectUsers(projectUsersDB);
    };

    function renderRow(data: any) {
        return (
            <View style={styles.outerView}>
                <View style={styles.avatar}>
                    <Image style={styles.avatarFace} source={data.photoURL} />
                </View>
                <View>
                    <Text style={styles.name}>{data.displayName || ""}</Text>
                </View>
            </View>
        );
    }

    return (
        <View>
            <View>
                <Text style={styles.accessHeader}></Text>
            </View>
            <View>
                {loading === false && (
                    <View>
                        <ShortList
                            key={projectUsers.key}
                            data={projectUsers}
                            renderItem={renderRow}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    accessHeader: {
        flexDirection: "row",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        marginTop: 5,
    },
    avatar: {},
    avatarFace: { borderRadius: 48 / 2, height: 48, width: 48 },
    name: {
        fontSize: 20,
        paddingLeft: 20,
    },
    outerView: {
        alignItems: "center",
        borderBottomColor: "#CED0CE",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        height: 80,
        paddingVertical: 8,
        padding: 8,
    },
});
