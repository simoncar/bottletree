import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Pressable,
} from "react-native";
import { Stack, router } from "expo-router";
import { Text, View, TextInput, Logo } from "@/components/Themed";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "@/constants/Colors";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useSession } from "@/lib/ctx";
import { About } from "@/lib/about";
import { Update } from "@/lib/update";
import { useTranslation } from "react-i18next";

export default function SignIn() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);
  const [showSignIn, setShowSignIn] = useState(false);
  const colorScheme = useColorScheme();
  const welcomeMarginTop = useSharedValue(100);
  const welcomeFontSize = useSharedValue(50);
  const { t } = useTranslation();

  const errorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return t("signIninvalidEmailAddressFormat");
      case "auth/invalid-credential":
        return t("signIninvalidEmailOrPasswordCheck");
      case "auth/user-disabled":
        return t("signInUserAccountHasBeenDisabled");
      case "auth/user-not-found":
        return t("signInUserAccountNotFound");
      case "auth/wrong-password":
        return t("signInIncorrectPassword");
      default:
        return errorCode;
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      router.push("/(app)");
    } catch (error) {
      console.log("handleSignIn: ", error);
      if (error && error.code) {
        setNotification(errorMessage(error.code));
      }
    } finally {
      // do something
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.topPanelCenter}>
        <Logo style={{ fontSize: 40 }}>One</Logo>
        <Text style={{ fontSize: 35 }}> </Text>
        <Logo style={{ fontSize: 40 }}>Build</Logo>
      </View>
      <View style={styles.updateContainer}>
        <Update />
      </View>

      {showSignIn && (
        <View style={styles.signInContainer}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.textInput}
              keyboardType="email-address"
              inputMode="email"
              placeholder={t("email")}
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
              placeholder={t("password")}
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

          <TouchableOpacity onPress={handleSignIn} style={styles.button}>
            <Text style={styles.loginText}>{t("signIn")}</Text>
          </TouchableOpacity>
          <Pressable
            key={"forgotPassword"}
            onPress={() => {
              router.navigate({
                pathname: "/forgotPassword",
                params: {
                  email: email,
                },
              });
            }}>
            <Text style={styles.forgotPassword}>
              {t("signInForgotPassword")}
            </Text>
          </Pressable>
        </View>
      )}

      {!showSignIn && (
        <TouchableOpacity
          key={"signIn"}
          style={[styles.button, { marginBottom: 30 }]}
          onPress={() => {
            welcomeMarginTop.value = withSpring(welcomeMarginTop.value - 50);
            welcomeFontSize.value = welcomeFontSize.value - 50;
            setShowSignIn(true);
          }}>
          <Text style={styles.createText}>{t("signIn")}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        key={"signUp"}
        style={styles.button}
        onPress={() => {
          router.navigate({
            pathname: "/signUp",
            params: {
              email: email,
            },
          });
        }}>
        <Text style={styles.createText}>{t("signInCreateANewAccount")}</Text>
      </TouchableOpacity>

      {!showSignIn && (
        <View style={styles.sloganView}>
          <Text style={styles.sloganText}>{t("slogan")}</Text>
        </View>
      )}

      <About />
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
  updateContainer: {
    paddingHorizontal: 16,
  },
  container: {
    alignItems: "center",
    flex: 1,
    paddingTop: 40,
  },
  createText: {
    fontSize: 18,
    color: "white",
  },
  eye: { color: "grey", paddingTop: 10 },
  forgotPassword: {
    fontSize: 14,
    paddingBottom: 20,
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
  topPanelCenter: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 80,
  },
  loginText: {
    fontSize: 18,
    color: "white",
  },
  notificationText: {
    color: "red",
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
    textAlign: "center",
  },
  sloganView: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    marginTop: 80,
    padding: 10,
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
    marginTop: 80,
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 10,
  },
});
