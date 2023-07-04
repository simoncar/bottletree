import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import React, { useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProjectContext from "../lib/projectContext";

const Project = (props) => {
    const { project, title, icon } = props;
    const { updateSharedDataProject } = useContext(ProjectContext);
    const router = useRouter();

    return (
        <View style={styles.outerView}>
            <Pressable
                style={styles.pressableLeft}
                onPress={() => {
                    updateSharedDataProject({
                        key: project,
                        title: title,
                        icon: icon,
                    });

                    router.replace({
                        pathname: "/editProject",
                        params: {
                            projectId: project,
                            projectTitle: title,
                            photoURL: encodeURIComponent(icon),
                        },
                    });
                }}>
                <View style={styles.avatar}>
                    {icon ? (
                        <Image
                            style={styles.projectAvatar}
                            source={icon}></Image>
                    ) : (
                        <View style={styles.projectAvatar}>
                            <Ionicons
                                name="ios-person"
                                color="#999999"
                                style={styles.avatarIcon}
                            />
                        </View>
                    )}
                </View>
            </Pressable>
            <Link href="/projectList" asChild>
                <Pressable style={styles.pressableRight}>
                    <View style={styles.projectText}>
                        <Text style={styles.updateText}>
                            {title || "Select Project"}
                        </Text>
                    </View>
                    <View style={styles.rightChevron}>
                        <FontAwesome5 name="angle-down" size={25} />
                    </View>
                </Pressable>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    avatar: {
        alignItems: "center",
        marginRight: 12,
        textAlign: "center",
        width: 50,
    },

    avatarIcon: {
        fontSize: 25,
        textAlign: "center",
    },
    pressableLeft: {
        alignItems: "center",
        width: 50,
    },
    pressableRight: {
        alignItems: "center",
        flexDirection: "row",
        flex: 1,
    },
    projectText: {
        alignItems: "center",
        flexDirection: "row",
        flex: 1,
    },
    outerView: {
        alignItems: "center",
        backgroundColor: "#E4E6C3",
        borderRadius: 100,
        flexDirection: "row",
    },

    projectAvatar: { borderRadius: 35 / 2, height: 35, width: 35 },
    rightChevron: {
        marginHorizontal: 8,
    },
    updateText: {
        fontSize: 16,
        marginRight: 12,
    },
});

export default Project;
function onItemClicked(post: any) {
    throw new Error("Function not implemented.");
}
