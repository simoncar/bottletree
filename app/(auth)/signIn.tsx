import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Pressable,
} from "react-native";
import { Stack, router } from "expo-router";
import { Text, View, TextInput } from "@/components/Themed";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "@/constants/Colors";
import { auth } from "@/lib/firebase";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateAccountName } from "@/lib/APIuser";
import { addLog } from "@/lib/APIlog";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);
  const [showSignIn, setShowSignIn] = useState(false);
  const colorScheme = useColorScheme();
  const welcomeMarginTop = useSharedValue(100);
  const welcomeFontSize = useSharedValue(50);

  const errorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Invalid email address format.";
      case "auth/invalid-credential":
        return "Invalid email or password. Check your login details and try again or create an account.";
      case "auth/user-disabled":
        return "User account has been disabled.";
      case "auth/user-not-found":
        return "User account not found.";
      case "auth/wrong-password":
        return "Incorrect password.";
      default:
        return errorCode;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Animated.View
        style={{
          alignItems: "center",
          marginBottom: 10,
          marginTop: welcomeMarginTop,
        }}>
        <Animated.View
          style={{
            height: welcomeFontSize,
          }}></Animated.View>
        <Text style={styles.welcomeText}>Welcome to</Text>

        <Text style={styles.welcomeApp}>Builder App</Text>
      </Animated.View>

      {showSignIn && (
        <View style={styles.signInContainer}>
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
            onPress={() => {
              AsyncStorage.clear().then(() => {
                console.log("Storage successfully cleared!");
                auth()
                  .signInWithEmailAndPassword(email, password)
                  .then(async (userCredential) => {
                    updateAccountName(userCredential.user.displayName);
                    addLog({
                      loglevel: "INFO",
                      message: "User signed in",
                      user: userCredential.user.uid,
                      email: userCredential.user.email,
                    });
                    //const goto = await mostRecentProject();
                    const goto = "welcome";
                    console.log("goto: ", goto);

                    router.navigate("/" + goto);
                  })
                  .catch((error) => {
                    setNotification(errorMessage(error.code));
                  });
              });
            }}
            style={styles.button}>
            <Text style={styles.loginText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            key={"forgotPassword"}
            onPress={() => {
              router.navigate({
                pathname: "/forgotPassword",
                params: {
                  email: email,
                },
              });
            }}>
            <Text style={styles.forgot_button}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      )}

      {!showSignIn && (
        <TouchableOpacity
          key={"signIn"}
          style={styles.button}
          onPress={() => {
            welcomeMarginTop.value = withSpring(welcomeMarginTop.value - 50);
            welcomeFontSize.value = welcomeFontSize.value - 50;
            setShowSignIn(true);
          }}>
          <Text style={styles.createText}>Sign in</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        key={"createAccount"}
        style={styles.button}
        onPress={() => {
          router.navigate({
            pathname: "/createAccount",
            params: {
              email: email,
            },
          });
        }}>
        <Text style={styles.createText}>Create a new account</Text>
      </TouchableOpacity>

      {!showSignIn && (
        <View style={styles.sloganView}>
          <Text style={styles.sloganText}>The ultimate app</Text>
          <Text style={styles.sloganText}>for modern house builders</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#9D5BD0",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    marginBottom: 10,
    width: 300,
  },
  container: {
    alignItems: "center",
    flex: 1,
    paddingTop: 40,
  },

  createText: {
    color: "white",
    fontSize: 18,
  },
  eye: { color: "grey", paddingTop: 10 },
  forgot_button: {
    fontSize: 14,
    height: 30,
    paddingBottom: 50,
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
  loginText: {
    color: "white",
    fontSize: 18,
  },
  notificationText: {
    fontSize: 18,
    textAlign: "center",
  },

  notificationView: {
    alignItems: "center",
    borderRadius: 5,
    justifyContent: "center",
    marginBottom: 20,
    width: "80%",
  },
  signInContainer: {
    alignItems: "center",
  },
  sloganText: {
    fontSize: 25,
    justifyContent: "center",
    marginBottom: 10,
  },
  sloganView: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    marginTop: 80,
  },
  textInput: {
    alignItems: "flex-start",
    flex: 1,
    fontSize: 18,
    height: 50,
    marginLeft: 10,
    padding: 10,
  },
  welcomeApp: {
    color: "#9D5BD0",
    fontSize: 45,
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 10,
  },
});
