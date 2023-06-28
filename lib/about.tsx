import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import * as Application from "expo-application";
import { useAuth, appSignIn } from "../lib/authProvider";

export const About = () => {
    const { shareDataUser, updateSharedData, signOut } = useAuth();

    if (null == shareDataUser) {
        return (
            <View>
                <Text style={styles.version}>About</Text>
            </View>
        );
    } else {
        return (
            <View style={styles.aboutContainer}>
                <Text style={styles.version}>
                    {Application.nativeApplicationVersion} (
                    {Application.nativeBuildVersion})
                </Text>
                <Text style={styles.version}>{shareDataUser.uid}</Text>
                <Text style={styles.version}>{shareDataUser.email}</Text>
                <Text style={styles.version}>{shareDataUser.displayName}</Text>
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
