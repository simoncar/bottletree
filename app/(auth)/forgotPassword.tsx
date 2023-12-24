import React, { useState } from "react";
import { StyleSheet, Button, TouchableOpacity } from "react-native";
import { useAuth } from "../../lib/authProvider";
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

      <View>
        <Text style={styles.resetHeader}>Can't log in?</Text>
      </View>

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

      <View>
        <Text>{errorMessage}</Text>
      </View>

      <TouchableOpacity
        onPress={async () => {
          console.log("touchable opacity signin");

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
  inputView: {
    borderRadius: 5,
    height: 45,
    marginBottom: 20,
    width: "90%",
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
  resetDetail: {
    fontSize: 18,
    paddingTop: 20,
  },
  resetHeader: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 20,
  },
});
