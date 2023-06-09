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
} from "react-native";

import { Text, TextInput, View, Button } from "../components/Themed";
import { updateProject } from "../lib/APIproject";
import { useProject } from "../lib/projectProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { addImage } from "../lib/APIimage";
import Colors from "../constants/Colors";
import { ProjectUsers } from "../components/ProjectUsers";

export default function editPost() {
    const { sharedData, updateSharedDataProject } = useProject();
    const { projectId, projectTitle, photoURL } = useLocalSearchParams();
    const [textPhotoURL, onChangeTextPhotoURL] = useState(photoURL);
    const [text, onChangeText] = useState(projectTitle);
    const colorScheme = useColorScheme();

    const { showActionSheetWithOptions } = useActionSheet();

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

    const progressCallback = (progress) => {
        console.log("progressCallback: " + progress);
    };

    const addImageCallback = (downloadURL: string) => {
        onChangeTextPhotoURL(downloadURL);
    };

    const pickImage = async () => {
        console.log("pickImage: ");
        addImage(progressCallback, addImageCallback);
    };

    const openActionSheet = async () => {
        const options = ["Pick from Camera Roll", "Delete", "Cancel"];
        const destructiveButtonIndex = options.length - 2;
        const cancelButtonIndex = options.length - 1;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                destructiveButtonIndex,
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        break;
                    case 1:
                        onChangeTextPhotoURL("");
                        break;
                }
            },
        );
    };

    const profilePic = () => {
        return (
            <View style={styles.profilePicContainer}>
                <TouchableOpacity
                    onPress={() => {
                        openActionSheet();
                    }}>
                    {textPhotoURL ? (
                        <Image
                            style={styles.profilePhoto}
                            source={textPhotoURL}
                        />
                    ) : (
                        <Ionicons
                            name="ios-person"
                            size={100}
                            color="#999999"
                            style={styles.profilePic}
                        />
                    )}
                    <View style={styles.circle}>
                        <Entypo name="camera" size={17} style={styles.camera} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

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

            <View style={styles.avatarAContainer}>
                <View style={styles.avatarBView}>{profilePic()}</View>
            </View>
            <View style={styles.projectNameContainer}>
                <View style={styles.projectBox}>
                    <TextInput
                        style={styles.project}
                        onChangeText={(text) => onChangeText(text)}
                        placeholder={"Project Title"}
                        value={text}
                        multiline
                    />
                </View>
            </View>

            <ProjectUsers project={projectId} />

            <Pressable
                style={styles.outerView}
                onPress={() => save(textPhotoURL, true)}>
                <View style={styles.avatar}>
                    <Ionicons
                        name="archive"
                        size={25}
                        color={Colors[colorScheme ?? "light"].text}
                    />
                </View>
                <View>
                    <Text style={styles.name}>Archive Project</Text>
                </View>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    avatar: { alignItems: "center", justifyContent: "center", width: 48 },
    avatarAContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 20,
    },

    avatarBView: {},
    camera: {
        color: "white",
        marginBottom: 2,
    },
    circle: {
        alignItems: "center",
        backgroundColor: "lightgrey",
        borderColor: "white",
        borderRadius: 30 / 2,
        borderWidth: 2,
        height: 30,
        justifyContent: "center",
        left: 115,
        position: "absolute",
        top: 115,
        width: 30,
    },
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

    profilePhoto: {
        borderColor: "grey",
        borderRadius: 150 / 2,
        borderWidth: 1,
        height: 150,
        overflow: "hidden",
        width: 150,
    },
    profilePic: {
        borderColor: "lightgray",
        height: 200,
    },
    profilePicContainer: {
        alignItems: "center",
        paddingBottom: 15,
        paddingHorizontal: 15,
        paddingTop: 15,
    },
    project: {
        fontSize: 25,
        fontWeight: "bold",
    },
    projectBox: {
        alignItems: "center",
        borderBottomColor: "#CED0CE",
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: "center",
        padding: 10,
        width: "85%",
    },
    projectNameContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 50,
        paddingTop: 20,
    },
});
