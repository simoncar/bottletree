import { ButtonYellow } from "@/components/Button";
import { Logo, Text, TextInput, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { About } from "@/lib/about";
import { useSession } from "@/lib/ctx";
import { Update } from "@/lib/update";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { useSharedValue } from "react-native-reanimated";

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

          <ButtonYellow onPress={handleSignIn} label={t("signIn")} />
          <Pressable
            key={"forgotPassword"}
            onPress={() => {
              router.navigate({
                pathname: "/forgotPassword",
                params: {
                  email: email,
                },
              });
            }}
          >
            <Text style={styles.forgotPassword}>
              {t("signInForgotPassword")}
            </Text>
          </Pressable>
        </View>
      )}

      {!showSignIn && (
        <ButtonYellow
          onPress={() => {
            setShowSignIn(true);
          }}
          label={t("signIn")}
        />
      )}

      <ButtonYellow
        onPress={() => {
          router.navigate({
            pathname: "/signUp",
            params: {
              email: email,
            },
          });
        }}
        label={t("signInCreateANewAccount")}
      />

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
    backgroundColor: "#F9D96B",
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
    paddingBottom: 20,
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
    marginHorizontal: 20,
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
    marginTop: 80,
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 10,
  },
});
