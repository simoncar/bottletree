import { useLocalSearchParams } from "expo-router";
import React, { useContext, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    useColorScheme,
    TouchableOpacity,
} from "react-native";
import { Text, View } from "../components/Themed";
import ProjectContext from "../lib/context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "../constants/Colors";
import { useAuth } from "../lib/authContext";
import { About } from "../lib/about";
import { useActionSheet } from "@expo/react-native-action-sheet";

export default function editUser() {
    const { sharedData } = useContext(ProjectContext);
    const { uid, photoURL } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const { deleteAccount, signOut } = useAuth();
    const { showActionSheetWithOptions } = useActionSheet();

    const save = () => {
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
                    {"statePhotoURL" ? (
                        <Image
                            style={styles.profilePhoto}
                            source={
                                "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface12.jpeg?alt=media&token=c048eee1-3673-4d5a-b35a-0e3c45a25c69"
                            }
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
            <View style={styles.avatarAContainer}>
                <View style={styles.avatarBView}>{profilePic()}</View>

                <View style={styles.nameContainer}>
                    <Text style={styles.name}>Jacob Graham</Text>
                </View>
            </View>

            <View style={styles.outerView}>
                <View style={styles.leftContent}>
                    <FontAwesome5
                        name="address-card"
                        size={25}
                        color={Colors[colorScheme ?? "light"].text}
                    />
                    <Text style={styles.settingName}>Contact Details</Text>
                </View>
                <View style={styles.rightChevron}>
                    <FontAwesome5
                        name="chevron-right"
                        size={20}
                        color={Colors[colorScheme ?? "light"].text}
                    />
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
        paddingTop: 50,
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
    name: {
        fontSize: 20,
        fontWeight: "bold",
    },
    nameContainer: {
        paddingBottom: 50,
        paddingTop: 20,
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

    rightChevron: {
        marginHorizontal: 8,
    },
    settingName: {
        fontSize: 20,
        paddingLeft: 20,
    },
});
