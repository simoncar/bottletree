import React from "react";
import { View, Dimensions, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import Constants from "expo-constants";

const Update = (props) => {
	const clickItem = () => {
		onItemClicked(post);
	};
	console.log("Update: renderPostContent", Constants);

	return (
		<View style={{ padding: 20 }}>
			<TouchableOpacity style={{ backgroundColor: "#E4E6C3", padding: 10, borderRadius: 100 }}>
				<Text style={styles.updateText}>Test Version {Constants.expoConfig?.ios?.buildNumber}</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	updateText: {
		fontSize: 16,
		marginRight: 12,
		alignItems: "center",
		textAlign: "center",
		color: "black"
	}
});

export default Update;
