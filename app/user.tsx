import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    useColorScheme,
    TouchableOpacity,
    Button,
} from "react-native";
import { Text, View, TextInput } from "../components/Themed";
import { useAuth, appSignIn } from "../lib/authProvider";
import { useRouter, Stack } from "expo-router";
import { Image } from "expo-image";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "../constants/Colors";
import { updateAccount } from "../lib/APIuser";
import { About } from "../lib/about";
import { useActionSheet } from "@expo/react-native-action-sheet";

export default function editUser() {
    const { uid, photoURL, displayName } = useLocalSearchParams();
    const [text, onChangeText] = useState(displayName);
    const router = useRouter();
    const colorScheme = useColorScheme();
    const { shareDataUser, updateSharedDataUser, signOut } = useAuth();
    const { showActionSheetWithOptions } = useActionSheet();

    console.log("editUser222: " + JSON.stringify(shareDataUser));

    useEffect(() => {
        onChangeText(shareDataUser.displayName);
    }, []);

    const save = () => {
        updateAccount(text); //firebease auth update function
        updateSharedDataUser({ displayName: text });
        router.push({
            pathname: "/",
            params: {
                project: "post.projectId",
            },
        });
    };

    const openActionSheet = async () => {
        const options = [
            "Take Photo",
            "Pick from Camera Roll",
            "Delete",
            "Cancel",
        ];
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
                        //props.navigation.push("CameraScreen");
                        break;
                    case 1:
                        //pickImage();
                        break;
                    case 2:
                        //setGPhotoURL("");
                        //setPhotoURL("");
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
                    {photoURL ? (
                        <Image style={styles.profilePhoto} source={photoURL} />
                    ) : (
                        <View style={styles.profileCircleIcon}>
                            <Ionicons
                                name="ios-person"
                                size={100}
                                color="#999999"
                                style={styles.profilePic}
                            />
                        </View>
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
                        <Button title="Done" onPress={() => save()} />
                    ),
                }}
            />
            <View style={styles.avatarAContainer}>
                <View style={styles.avatarBView}>{profilePic()}</View>

                <View style={styles.projectNameContainer}>
                    <View style={styles.projectBox}>
                        <TextInput
                            style={styles.project}
                            onChangeText={(text) => onChangeText(text)}
                            placeholder={"Your Name"}
                            value={text}
                            multiline
                        />
                    </View>
                </View>
            </View>

            <TouchableOpacity
                key={"deleteAccount"}
                onPress={() =>
                    router.push({
                        pathname: "/deleteAccount",
                    })
                }>
                <View style={styles.outerView}>
                    <View style={styles.leftContent}>
                        <FontAwesome5
                            name="trash-alt"
                            size={25}
                            color={Colors[colorScheme ?? "light"].text}
                        />
                        <Text style={styles.settingName}>Delete Account</Text>
                    </View>
                    <View style={styles.rightChevron}>
                        <FontAwesome5
                            name="chevron-right"
                            size={20}
                            color={Colors[colorScheme ?? "light"].text}
                        />
                    </View>
                </View>
            </TouchableOpacity>

            <View style={styles.outerView}>
                <TouchableOpacity key={"signOut"} onPress={() => signOut()}>
                    <View style={styles.leftContent}>
                        <MaterialIcons
                            name="logout"
                            size={25}
                            color={Colors[colorScheme ?? "light"].text}
                        />
                        <Text style={styles.settingName}>Log Out</Text>
                    </View>
                    <View style={styles.rightChevron}></View>
                </TouchableOpacity>
            </View>

            <View style={styles.aboutContainer}>
                <About />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    aboutContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 50,
    },
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
    leftContent: {
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
    profileCircleIcon: {
        alignItems: "center",
        borderColor: "lightgray",
        borderRadius: 150 / 2,
        borderWidth: 1,
        height: 150,
        justifyContent: "center",
        width: 150,
    },
    profilePhoto: {
        borderColor: "grey",
        borderRadius: 150 / 2,
        borderWidth: 1,
        height: 150,
        overflow: "hidden",
        width: 150,
    },
    project: {
        fontSize: 25,
        fontWeight: "bold",
    },
    profilePic: {},
    projectBox: {
        alignItems: "center",
        borderBottomColor: "#CED0CE",
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: "center",
        padding: 10,
        width: "85%",
    },
    profilePicContainer: {
        alignItems: "center",
        paddingBottom: 15,
        paddingHorizontal: 15,
        paddingTop: 15,
    },

    projectNameContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 50,
        paddingTop: 20,
    },
    rightChevron: {
        marginHorizontal: 8,
    },
    settingName: {
        fontSize: 20,
        paddingLeft: 20,
    },
});
