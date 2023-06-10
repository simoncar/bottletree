import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Link, useNavigation } from "expo-router";
import React from "react";
import { Text, View } from "../components/Themed";

export default function ModalScreen() {
	const navigation = useNavigation();
	const isPresented = navigation.canGoBack();

	function renderRow(title: string) {
		return (
			<TouchableOpacity>
				<View style={styles.outerView}>
					<Text style={styles.project}>{title || ""}</Text>
				</View>
			</TouchableOpacity>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.projectList}>
				{renderRow("106 Jolimont Road")}
				{renderRow("33 Queen Street")}
				{renderRow("Plaza 222 - Level 44")}
				{renderRow("106 Jolimont Road")}
			</View>

			<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

			<Link href="../">Ok</Link>

			{/* Use a light status bar on iOS to account for the black space above the modal */}
			<StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center"
	},

	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 20
	},
	projectList: {
		alignContent: "flex-start"
	},

	project: {
		fontSize: 18,
		marginBottom: 5
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%"
	},
	innerView: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 8
	},

	outerView: {
		borderBottomColor: "#CED0CE",
		borderBottomWidth: StyleSheet.hairlineWidth,
		flexDirection: "row",
		paddingVertical: 8
	},
	outerViewLast: {
		alignItems: "center",
		borderBottomColor: "#CED0CE",
		flexDirection: "row",
		paddingVertical: 8
	},
	rightChevron: {
		marginHorizontal: 8
	},
	separator: {
		backgroundColor: "#CED0CE",
		height: 1,
		marginTop: 30,
		width: "100%"
	},
	subtitle: {
		color: "#777777"
	}
});
