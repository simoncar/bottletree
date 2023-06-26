import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import * as Application from "expo-application";
import { useAuth } from "../lib/authProvider";

export const About = () => {
    const { user, updateSharedData } = useAuth();

    if (null == user) {
        return;
    } else {
        return (
            <View style={styles.aboutContainer}>
                <Text style={styles.version}>
                    {Application.nativeApplicationVersion} (
                    {Application.nativeBuildVersion})
                </Text>
                <Text style={styles.version}>{user.uid}</Text>
                <Text style={styles.version}>{user.displayName}</Text>
                <Text style={styles.version}>{user.email}</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    aboutContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 50,
    },
    version: {
        color: "grey",
        fontSize: 14,
    },
});
