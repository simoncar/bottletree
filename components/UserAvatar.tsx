import React from "react";
import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Text, View } from "../components/Themed";

import Ionicons from "@expo/vector-icons/Ionicons";

function isEmpty(value) {
    return value == null || value.length === 0;
}

const renderPhotoURL = (photoURL) => {
    if (isEmpty(photoURL)) {
        return (
            <View>
                <Image style={styles.avatarFace} source={photoURL}></Image>
            </View>
        );
    } else {
        return (
            <View>
                <Ionicons name="ios-person-circle-outline" size={40} />
            </View>
        );
    }
};

export const UserAvatar = (props) => {
    const { uid, photoURL } = props;
    const router = useRouter();

    return (
        <TouchableOpacity
            key={"editProfile"}
            onPress={() => {
                router.push({
                    pathname: "/user",
                    params: {
                        uid: uid,
                        photoURL: photoURL,
                    },
                });
            }}>
            <View style={styles.avatar}>{renderPhotoURL(photoURL)}</View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    avatar: {
        alignItems: "center",
        marginRight: 12,
        textAlign: "center",
        width: 50,
    },
    avatarFace: { borderRadius: 35 / 2, height: 35, width: 35 },
});
