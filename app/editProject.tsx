import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
    Button,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { ShortList } from "../components/sComponent";
import { Text, TextInput, View } from "../components/Themed";
import { getProjectUsers, updateProject } from "../lib/APIprojects";
import ProjectContext from "../lib/projectContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { addImage } from "../lib/APIimage";

export default function editPost() {
    const { sharedData, updateSharedDataProject } = useContext(ProjectContext);
    const { projectId, projectTitle, photoURL } = useLocalSearchParams();
    const [textPhotoURL, onChangeTextPhotoURL] = useState(photoURL);
    const [text, onChangeText] = useState(projectTitle);
    const [projectUsers, setProjectUsers] = useState("");
    const [loading, setLoading] = useState(true);
    const { showActionSheetWithOptions } = useActionSheet();

    console.log("editProject.tsx: projectId: " + projectId);

    const router = useRouter();

    const projectUsersRead = (projectUsersDB) => {
        setProjectUsers(projectUsersDB);
    };

    useEffect(() => {
        const unsubscribe = getProjectUsers(projectId, projectUsersRead);
        return () => {
            unsubscribe;
        };
    }, []);

    useEffect(() => {
        if (projectUsers !== "" && loading === true) {
            setLoading(false);
        }
    }, [projectUsers]);

    const saveDone = (id: string) => {
        console.log("editProject.tsx: saveDone: id: " + text);

        updateSharedDataProject({
            projectId: id,
            projectTitle: text,
            projectIcon: textPhotoURL,
        });

        router.push({
            pathname: "/",
            params: {
                project: id,
                title: text,
                icon: encodeURIComponent(sharedData.projectIcon),
            },
        });
    };

    const save = (downloadURL: string) => {
        console.log("XXXXeditProject.tsx: save: text: " + downloadURL);

        updateProject(
            {
                key: projectId,
                title: text,
                icon: downloadURL,
            },
            saveDone,
        );
    };

    function renderRow(data: any) {
        return (
            <View style={styles.outerView}>
                <View style={styles.avatar}>
                    <Image
                        style={styles.avatarFace}
                        source={data.avatar}></Image>
                </View>
                <View>
                    <Text style={styles.name}>{data.name || ""}</Text>
                </View>
            </View>
        );
    }

    const progressCallback = (progress) => {
        console.log("progressCallback: " + progress);
    };

    const addImageCallback = (downloadURL: string) => {
        onChangeTextPhotoURL(downloadURL);
        save(downloadURL);

        //updateAccountPhotoURL(downloadURL); //firebease auth update function
        //updateSharedDataUser({ photoURL: downloadURL });
        //  setImage(null);
        //  addPost(
        //      {
        //          projectId: sharedData.projectId,
        //          author: "DDDD",
        //          images: [downloadURL],
        //      },
        //      saveDone,
        //  );
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
                        //updateAccountPhotoURL("");
                        //updateSharedDataUser({ photoURL: "" });
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
                        <Button
                            title="Done"
                            onPress={() => save(textPhotoURL)}
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

            <View>
                <View style={styles.avatarAContainer}>
                    <Text style={styles.accessHeader}> Access List</Text>
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    accessHeader: {
        flexDirection: "row",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        marginTop: 5,
    },
    avatar: {},
    avatarAContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 20,
    },
    avatarBView: {},

    avatarFace: { borderRadius: 48 / 2, height: 48, width: 48 },
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
