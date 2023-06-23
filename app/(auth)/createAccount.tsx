import React, { useState } from "react";
import { StyleSheet, Button, TouchableOpacity } from "react-native";
import { useAuth, appSignIn } from "../../lib/authContext";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { Text, View, TextInput } from "../../components/Themed";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const { createAccount } = useAuth();
	const router = useRouter();

	const createAccountCallback = (error) => {
		console.log("errorerrorerrorerrorerror:", error);
		setErrorMessage(error);
	};

	const renderAction = (errorMessage) => {
		console.log("error message: ", errorMessage);

		if (errorMessage == "Success") {
			return;
		} else {
			return (
				<TouchableOpacity
					onPress={async () => {
						console.log("touchable opacity signin");

						createAccount(name, email, password, createAccountCallback);
						//const resp = await appSignIn("simoncar@gmail.com", "password");
						//console.log("resp: ", resp);
						// if (resp?.user) {
						// 	router.replace("/(tabs)/home");
						// } else {
						// 	console.log(resp.error);
						// 	Alert.alert("Login Error", resp.error?.message);
						// }
					}}
					style={styles.loginBtn}
				>
					<Text style={styles.loginText}>CREATE ACCOUNT</Text>
				</TouchableOpacity>
			);
		}
	};

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ title: "Create Account" }} />

			<View style={styles.inputView}>
				<TextInput style={styles.TextInput} inputMode="text" placeholder="Name" autoCorrect={false} autoFocus autocomplete="name" onChangeText={(name) => setName(name)} />
			</View>
			<View style={styles.inputView}>
				<TextInput style={styles.TextInput} keyboardType="email-address" inputMode="email" placeholder="Email" autocomplete="email" onChangeText={(email) => setEmail(email)} />
			</View>
			<View style={styles.inputView}>
				<TextInput
					style={styles.TextInput}
					placeholder="Password"
					secureTextEntry={true}
					onChangeText={(password) => {
						setPassword(password);
						setErrorMessage("");
					}}
				/>
			</View>
			<View>
				<Text>{errorMessage}</Text>
			</View>

			{renderAction(errorMessage)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		paddingTop: 100
	},

	inputView: {
		borderRadius: 5,
		width: "70%",
		height: 45,
		marginBottom: 20
	},
	TextInput: {
		height: 50,
		flex: 1,
		padding: 10,
		marginLeft: 20,
		alignItems: "flex-start",
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "#CED0CE"
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
