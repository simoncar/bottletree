import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "@/lib/authProvider";
import { Stack, router } from "expo-router";
import { deleteUser } from "@/lib/APIuser";
import { Text, View } from "@/components/Themed";

export default function DeleteAccount() {
  const [errorMessage, setErrorMessage] = useState("");
  const { deleteAccount, sharedDataUser } = useAuth();

  const deleteAccountCallback = (error) => {
    console.log("Delete Account Error:", error);
    setErrorMessage(error);
  };

  const deleteUserCallback = (error) => {
    console.log("Delete User Error:", error);
    setErrorMessage(error);
  };

  const onDelete = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            deleteUser(sharedDataUser.uid, deleteUserCallback);
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
        <Text style={styles.welcomeText}>
          Are you sure you want to delete your account?
        </Text>
        <Text style={styles.welcomeText}>
          If you change your mind, you will not be able to undo this.
        </Text>
      </View>

      <TouchableOpacity
        onPress={async () => {
          onDelete();
        }}
        style={styles.button}>
        <Text style={styles.buttonText}>YES, Delete my account</Text>
      </TouchableOpacity>
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
    marginBottom: 40,
    marginTop: 50,
    width: 300,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
  },
  container: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
