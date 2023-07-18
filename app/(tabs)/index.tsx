import React from "react";
import { StyleSheet } from "react-native";
import { Posts } from "../../components/Posts";
import { View } from "../../components/Themed";






export default function TabOneScreen() {
	return (
		<View style={styles.container}>
			<Posts />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center"
	}
});
