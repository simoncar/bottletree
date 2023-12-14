import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Pressable,
} from "react-native";
import { useAuth } from "../../lib/authProvider";
import { Stack, router } from "expo-router";
import { Text, View, TextInput } from "../../components/Themed";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "../../constants/Colors";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);
  const { signIn } = useAuth();
  const colorScheme = useColorScheme();

  const ERROR_MAP = {
    "Firebase: Error (auth/email-already-in-use).":
      "Email is already in use, try a different one.",
    "Username already exists": "Username already exists, try a different one.",
    "Firebase: Password should be at least 6 characters (auth/weak-password).":
      "Password must be at least 6 characters long.",
    "Firebase: Error (auth/wrong-password).":
      "Wrong password. Try again or click Forgot password to reset it.",
    "[auth/user-not-found] There is no user record corresponding to this identifier. The user may have been deleted.":
      "No account found with this email.",
    "[auth/invalid-email] The email address is badly formatted.":
      "The entered email address is not valid.",
    "Firebase: Error (auth/network-request-failed).":
      "Network error. Check your internet connection.",
    "[auth/wrong-password] The password is invalid or the user does not have a password.":
      "The password is invalid.",
  };

  const loginError = (error) => {
    console.log("loginError: ", error);

    setNotification(ERROR_MAP[error] || error);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Sign In",
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
        }}
      />

      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
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
          style={styles.textInput}
          placeholder="Password"
          secureTextEntry={secureEntry}
          onChangeText={(password) => {
            setPassword(password);
            setNotification("");
          }}
        />
        <Pressable onPress={() => setSecureEntry(!secureEntry)}>
          <AntDesign
            name="eye"
            size={25}
            style={styles.eye}
            color={Colors[colorScheme ?? "light"].text}
          />
        </Pressable>
      </View>
      <View style={styles.notificationView}>
        <Text numberOfLines={3} style={styles.notificationText}>
          {notification}
        </Text>
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
  container: {
    alignItems: "center",
    flex: 1,
    paddingTop: 40,
  },
  eye: { color: "grey", paddingTop: 10 },
  forgot_button: {
    fontSize: 18,
    height: 30,
    marginTop: 30,
  },

  inputView: {
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    flexDirection: "row",
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
  notificationText: {
    color: "red",
    fontSize: 18,
  },
  notificationView: {
    borderRadius: 5,
    marginBottom: 20,
    width: "80%",
  },
  textInput: {
    alignItems: "flex-start",
    flex: 1,
    fontSize: 18,
    height: 50,
    marginLeft: 10,
    padding: 10,
  },
});
