import { ButtonYellow } from "@/components/Button";
import { Text, View } from "@/components/Themed";
import { deleteUser } from "@/lib/APIuser";
import { useSession } from "@/lib/ctx";
import { UserContext } from "@/lib/UserContext";
import { Stack, router } from "expo-router";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "@react-native-firebase/auth";

export default function DeleteAccount() {
  const [errorMessage, setErrorMessage] = useState("");
  const { deleteAccount, signOut } = useSession();
  const { user, setUser } = useContext(UserContext);
  const { t } = useTranslation();

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
      t("deleteAccount"),
      t("areYouSure"),
      [
        {
          text: t("cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("yes"),
          onPress: () => {
            deleteUser(user?.uid, deleteUserCallback);
            setUser(null);
            signOut();
            AsyncStorage.clear();
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
          title: t("deleteAccount"),
        }}
      />

      <View style={styles.instructions}>
        <Text style={styles.text}>
          {t("areYouSureYouWantToDeleteYourAccount")}
        </Text>
        <Text style={styles.text}>
          {t("ifYouChangeYourMindYouWillNotBeAbleToUndoThis")}.
        </Text>
        <Text style={styles.error}>{errorMessage}</Text>
      </View>

      <ButtonYellow
        onPress={async () => {
          onDelete();
        }}
        label={t("yesDeleteMyAccount")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
