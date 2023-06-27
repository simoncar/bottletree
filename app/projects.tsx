import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { collection, getDocs } from "firebase/firestore";
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
import { db } from "../lib/firebase";

export default function ModalScreen() {
    const [projects, setProjects] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const colorScheme = useColorScheme();
    const { updateSharedDataProject } = useContext(ProjectContext);

    const projectsRead = (projectsDB) => {
        setProjects(projectsDB);
    };

    useEffect(() => {
        const unsubscribe = getProjects(projectsRead);
        return () => {
            unsubscribe;
        };
    }, []);

    useEffect(() => {
        if (projects !== "" && loading === true) {
            setLoading(false);
        }
    }, [projects]);

    function readProjects() {
        getDocs(collection(db, "projects")).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log("Reading Projects: ", doc.id, " => ", doc.data());
            });
        });
    }

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

    function renderRow(data: any) {
        return (
            <View key={data.key} style={styles.outerView}>
                <TouchableOpacity
                    key={data.key}
                    style={styles.innerView}
                    onPress={() => {
                        updateSharedDataProject({
                            projectId: data.key,
                            projectTitle: data.title,
                            projectIcon: data.icon,
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
                        <Image
                            style={styles.avatarFace}
                            source={data.icon}></Image>
                    </View>
                    <View>
                        <Text style={styles.project}>{data.title || ""}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    key={"chevron." + data.key}
                    onPress={() => {
                        updateSharedDataProject({
                            projectId: data.key,
                            projectTitle: data.title,
                            projectIcon: data.icon,
                        });

                        router.replace({
                            pathname: "/editProject",
                            params: {
                                projectId: data.key,
                                projectTitle: data.title,
                                icon: encodeURIComponent(data.icon),
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
    container: {
        flex: 1,
    },

    projectList: {},
    innerView: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal: 8,
    },

    project: {
        fontSize: 18,
        marginBottom: 5,
    },
    rightChevron: {
        marginHorizontal: 8,
    },

    avatar: {
        marginRight: 12,
        width: 50,
    },
    avatarFace: { width: 48, height: 48, borderRadius: 48 / 2 },

    outerView: {
        borderBottomColor: "#CED0CE",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        paddingVertical: 8,
        alignItems: "center",
        padding: 8,
        height: 80,
    },
});
