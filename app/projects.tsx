import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import {
    Platform,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
} from "react-native";
import { ShortList } from "../components/sComponent";
import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import { getProjects } from "../lib/APIprojects";
import ProjectContext from "../lib/projectContext";
import { IProject } from "../lib/types";

export default function ModalScreen() {
    const [projects, setProjects] = useState<IProject[] | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const colorScheme = useColorScheme();
    const { updateSharedDataProject } = useContext(ProjectContext);

    const projectsRead = (projectsDB: IProject[]) => {
        setProjects(projectsDB);
    };

    useEffect(() => {
        const unsubscribe = getProjects(projectsRead);
        return () => {
            unsubscribe;
        };
    }, []);

    useEffect(() => {
        if (projects !== null && loading === true) {
            setLoading(false);
        }
    }, [projects]);

    function renderAdd() {
        return (
            <TouchableOpacity
                key={"addProject"}
                onPress={() => {
                    console.log("Add Project");

                    router.replace({
                        pathname: "/addProject",
                        params: {
                            project: "post.projectId",
                        },
                    });
                }}>
                <View style={styles.outerView}>
                    <View style={styles.innerView}>
                        <View style={styles.avatar}>
                            <Pressable>
                                {({ pressed }) => (
                                    <FontAwesome5
                                        name="plus"
                                        size={25}
                                        color={
                                            Colors[colorScheme ?? "light"].text
                                        }
                                        style={{ opacity: pressed ? 0.5 : 1 }}
                                    />
                                )}
                            </Pressable>
                        </View>
                        <View>
                            <Text style={styles.project}>Add Project</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    function renderRow(data: IProject) {
        return (
            <View key={data.key} style={styles.outerView}>
                <TouchableOpacity
                    key={data.key}
                    style={styles.innerView}
                    onPress={() => {
                        updateSharedDataProject({
                            key: data.key,
                            title: data.title,
                            icon: data.icon,
                        });

                        router.push({
                            pathname: "/",
                            params: {
                                projectId: data.key,
                                title: data.title,
                                icon: encodeURIComponent(data.icon),
                            },
                        });
                    }}>
                    <View style={styles.avatar}>
                        <Image style={styles.avatarFace} source={data.icon} />
                    </View>
                    <View>
                        <Text style={styles.project}>{data.title || ""}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    key={"chevron." + data.key}
                    onPress={() => {
                        updateSharedDataProject({
                            key: data.key,
                            title: data.title,
                            icon: data.icon,
                        });

                        router.replace({
                            pathname: "/editProject",
                            params: {
                                projectId: data.key,
                                projectTitle: data.title,
                                photoURL: encodeURIComponent(data.icon),
                            },
                        });
                    }}>
                    <View style={styles.rightChevron}>
                        <FontAwesome5
                            name="chevron-right"
                            size={25}
                            color={Colors[colorScheme ?? "light"].text}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.projectList}>
                {loading === false && (
                    <View>
                        <ShortList
                            key={projects.key}
                            data={projects}
                            renderItem={renderRow}
                        />
                    </View>
                )}
                <View>{renderAdd()}</View>
            </View>

            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </View>
    );
}

const styles = StyleSheet.create({
    avatar: {
        marginRight: 12,
        width: 50,
    },

    avatarFace: { borderRadius: 48 / 2, height: 48, width: 48 },
    container: {
        flex: 1,
    },

    innerView: {
        alignItems: "center",
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingHorizontal: 8,
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

    project: {
        fontSize: 18,
        marginBottom: 5,
    },
    projectList: {},

    rightChevron: {
        marginHorizontal: 8,
    },
});
