import React, { useState, useContext } from "react";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useSession } from "@/lib/ctx";
import { Stack, router } from "expo-router";
import { deleteUser } from "@/lib/APIuser";
import { Text, View } from "@/components/Themed";
import { UserContext } from "../../lib/UserContext";
import { Back } from "@/components/Back";

export default function DeleteAccount() {
  const [errorMessage, setErrorMessage] = useState("");
  const { deleteAccount } = useSession();
  const { user, setUser } = useContext(UserContext);

  const deleteAccountCallback = (error: any) => {
    if (error == null) {
      setUser(null);
      router.replace("/signIn");
    } else {
      console.log("Delete Account Error:", error);
      setErrorMessage(error);
    }
  };

  const deleteUserCallback = (error: any) => {
    if (error == null) {
      console.log("Delete User Success");
    } else {
      console.log("Delete User Error:", error);
      setErrorMessage(error);
    }
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
            deleteUser(user?.uid, deleteUserCallback);
            deleteAccount(deleteAccountCallback);
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Delete Account",
          headerLeft: () => <Back />,
        }}
      />

      <View style={styles.instructions}>
        <Text style={styles.text}>
          Are you sure you want to delete your account?
        </Text>
        <Text style={styles.text}>
          If you change your mind, you will not be able to undo this.
        </Text>
        <Text style={styles.error}>{errorMessage}</Text>
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
  error: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  instructions: {
    padding: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});
