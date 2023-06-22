import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import Constants from "expo-constants";
import * as Application from "expo-application";
import * as Device from "expo-device";

export const About = () => {
	return (
		<View style={styles.aboutContainer}>
			<Text style={styles.version}>
				{Application.nativeApplicationVersion} ({Application.nativeBuildVersion})
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	version: {
		fontSize: 14,
		color: "grey"
	},
	aboutContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 50
	}
});
