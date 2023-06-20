import React from "react";
import { StyleSheet } from "react-native";
import { Posts } from "../../components/Posts";
import { View } from "../../components/Themed";
import { demoData } from "../../lib/demoData";

demoData();

export default function TabOneScreen() {
	return (
		<View style={styles.container}>
			<Posts />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	}
});
