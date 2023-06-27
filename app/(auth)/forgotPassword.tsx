import React, { useState } from "react";
import { StyleSheet, Button, TouchableOpacity } from "react-native";
import { useAuth, appSignIn } from "../../lib/authProvider";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { Text, View, TextInput } from "../../components/Themed";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const { resetPassword } = useAuth();

	const resetError = (error) => {
		console.log("reset ERROR:", error);
		setErrorMessage(error);
	};

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ title: "Reset Password" }} />

			<Image
				style={styles.image}
				source={"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Flogo%2FArm-Hammer-Logo.png?alt=media&token=cf1c4663-08f2-4bbf-bfc6-27fb3f4d098d"}
			/>

			<View>
				<Text style={styles.resetHeader}>Can't log in?</Text>
			</View>

			<View style={styles.inputView}>
				<TextInput style={styles.TextInput} keyboardType="email-address" inputMode="email" placeholder="Email" autoFocus autocomplete="email" onChangeText={(email) => setEmail(email)} />
			</View>

			<View>
				<Text>{errorMessage}</Text>
			</View>

			<TouchableOpacity
				onPress={async () => {
					console.log("touchable opacity signin");

					resetPassword(email, resetError);
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
				<Text style={styles.loginText}>SEND RESET LINK</Text>
			</TouchableOpacity>
			<View>
				<Text style={styles.resetDetail}>We will email you a password reset link.</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center"
	},
	image: {
		width: 200,
		height: 200,
		marginBottom: 50,
		marginTop: 50
	},
	inputView: {
		borderRadius: 5,
		width: "70%",
		height: 45,
		marginBottom: 20
	},
	resetHeader: {
		fontSize: 20,
		fontWeight: "bold",
		paddingBottom: 20
	},
	resetDetail: {
		paddingTop: 20
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
	forgot_button: {
		height: 30,
		marginTop: 30
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
