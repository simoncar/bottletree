import React, { useState } from "react";
import { StyleSheet, Button, TouchableOpacity, Alert } from "react-native";
import { useAuth, appSignIn } from "../lib/authContext";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { Text, View, TextInput } from "../components/Themed";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const { deleteAccount } = useAuth();
	const router = useRouter();

	const deleteAccountCallback = (error) => {
		console.log("errorerrorerrorerrorerror:", error);
		setErrorMessage(error);
	};

	const onDelete = () => {
		Alert.alert(
			"Delete",
			"Are you sure?",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel"
				},
				{
					text: "Delete",
					onPress: () => {
						deleteAccount(deleteAccountCallback);
					}
				}
			],
			{ cancelable: false }
		);
	};

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ title: "Delete Account" }} />

			<View>
				<Text>Are you sure you want to delete your account?</Text>
				<Text>If you change your mind, you will not be able to undo this.</Text>
			</View>

			<TouchableOpacity
				onPress={async () => {
					onDelete();
				}}
				style={styles.loginBtn}
			>
				<Text style={styles.loginText}>Yes, DELETE MY ACCOUNT</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		paddingTop: 100
	},

	loginText: {
		color: "#000"
	},
	loginBtn: {
		width: "80%",
		borderRadius: 25,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 40,
		backgroundColor: "#E4E6C3"
	}
});
