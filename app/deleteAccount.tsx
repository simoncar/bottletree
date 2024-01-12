import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "@/lib/authProvider";
import { Stack, router } from "expo-router";
import { Text, View } from "@/components/Themed";

export default function DeleteAccount() {
  const [errorMessage, setErrorMessage] = useState("");

  const { deleteAccount } = useAuth();

  const deleteAccountCallback = (error) => {
    console.log("Delete Account Error:", error);
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
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteAccount(deleteAccountCallback);
          },
        },
      ],
      { cancelable: false },
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
        style={styles.loginBtn}>
        <Text style={styles.loginText}>Yes, DELETE MY ACCOUNT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    paddingTop: 100,
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
    color: "#000",
  },
});
