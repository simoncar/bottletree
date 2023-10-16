import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../../lib/authProvider";
import { Stack, router } from "expo-router";
import { Text, View, TextInput } from "../../components/Themed";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState("");
  const { signIn } = useAuth();

  const ERROR_MAP = {
    "Firebase: Error (auth/email-already-in-use).":
      "Email is already in use, try a different one.",
    "Username already exists": "Username already exists, try a different one.",
    "Firebase: Password should be at least 6 characters (auth/weak-password).":
      "Password must be at least 6 characters long.",
    "Firebase: Error (auth/wrong-password).":
      "Wrong password. Try again or click Forgot password to reset it.",
    "Firebase: Error (auth/user-not-found).": "No account with this email.",
    "Firebase: Error (auth/invalid-email).":
      "The entered email address is not valid.",
    "Firebase: Error (auth/network-request-failed).":
      "Network error. Check your internet connection.",
  };

  const loginError = (error) => {
    setNotification(ERROR_MAP[error] || error);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Sign In" }} />

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          keyboardType="email-address"
          inputMode="email"
          placeholder="Email"
          autoCapitalize="none"
          autoFocus
          autoComplete="email"
          spellCheck={false}
          onChangeText={(email) => setEmail(email)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(password) => {
            setPassword(password);
            setNotification("");
          }}
        />
      </View>
      <View>
        <Text>{notification}</Text>
      </View>

      <TouchableOpacity
        onPress={async () => {
          signIn(email, password, loginError);
          //const resp = await appSignIn("simoncar@gmail.com", "password");
          //console.log("resp: ", resp);
          // if (resp?.user) {
          // 	router.replace("/(tabs)/home");
          // } else {
          // 	console.log(resp.error);
          // 	Alert.alert("Login Error", resp.error?.message);
          // }
        }}
        style={styles.loginBtn}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        key={"forgotPassword"}
        onPress={() => {
          router.push({
            pathname: "/forgotPassword",
            params: {
              email: email,
            },
          });
        }}>
        <Text style={styles.forgot_button}>Forgot password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        key={"createAccount"}
        onPress={() => {
          router.push({
            pathname: "/createAccount",
            params: {
              email: email,
            },
          });
        }}>
        <Text style={styles.forgot_button}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  TextInput: {
    alignItems: "flex-start",
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    fontSize: 18,
    height: 50,
    marginLeft: 20,
    padding: 10,
  },
  container: {
    alignItems: "center",
    flex: 1,
    paddingTop: 40,
  },
  forgot_button: {
    height: 30,
    fontSize: 18,
    marginTop: 30,
  },

  inputView: {
    borderRadius: 5,
    height: 45,
    marginBottom: 20,
    width: "80%",
  },
  loginBtn: {
    alignItems: "center",
    backgroundColor: "#2196F3",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    marginTop: 40,
    width: "80%",
  },
  loginText: {
    color: "white",
    fontSize: 18,
  },
});
