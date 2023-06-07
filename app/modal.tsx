import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Link, useNavigation } from "expo-router";

import { Text, View } from "../components/Themed";

export default function ModalScreen() {
	const navigation = useNavigation();
	const isPresented = navigation.canGoBack();
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Projects</Text>
			<View style={styles.projectList}>
				<Text style={styles.project}>- 106 Jolimont Road</Text>
				<Text style={styles.project}>- 33 Queen Street</Text>
				<Text style={styles.project}>- Plaza 222 - Level 44</Text>
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
	}
});
