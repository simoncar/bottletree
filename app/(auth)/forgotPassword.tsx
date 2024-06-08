import React, { useState } from "react";
import { StyleSheet, Button, TouchableOpacity } from "react-native";
import { useAuth } from "@/lib/authProvider";
import { Stack } from "expo-router";
import { Text, View, TextInput } from "@/components/Themed";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { resetPassword } = useAuth();

  const resetError = (error) => {
    setErrorMessage(strip(error));
  };

  const strip = (str: string) => {
    return str.substring(str.lastIndexOf("]") + 1).trim();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Reset Password" }} />

      <View>
        <Text style={styles.heading}>Can't log in?</Text>
      </View>

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

      <View style={styles.notificationView}>
        <Text numberOfLines={3} style={styles.notificationText}>
          {errorMessage}
        </Text>
      </View>

      <TouchableOpacity
        onPress={async () => {
          resetPassword(email, resetError);
        }}
        style={styles.loginBtn}>
        <Text style={styles.loginText}>SEND RESET LINK</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.resetDetail}>
          We will email you a password reset link.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    paddingTop: 100,
  },
  heading: {
    fontSize: 24,
    paddingBottom: 30,
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
    backgroundColor: "#9D5BD0",
    borderRadius: 10,
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
    fontSize: 18,
  },
  notificationView: {
    borderRadius: 5,
    marginBottom: 20,
    width: "80%",
  },
  resetDetail: {
    fontSize: 18,
    paddingBottom: 30,
    paddingTop: 30,
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
