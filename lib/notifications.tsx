import React, { useContext, useEffect, useState } from "react";
import { Button, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { useSession } from "@/lib/ctx";
import { auth } from "@/lib/firebase";
import { UserContext } from "@/lib/UserContext";
import { registerForPushNotificationsAsync } from "./APINotification";
import Constants from "expo-constants";

export const Notifications = () => {
  const { user } = useContext(UserContext);
  const { session } = useSession();
  const [expoPushToken, setExpoPushToken] = useState("");
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  useEffect(() => {
    // registerForPushNotificationsAsync()
    //   .then((token) => setExpoPushToken(token ?? ""))
    //   .catch((error: any) => setExpoPushToken(`${error}`));
  }, []);

  if (null == user) {
    return <View />;
  } else {
    return (
      <View style={styles.aboutContainer}>
        <Text style={styles.version}>Notifications</Text>
        <Text style={styles.version}>
          Your Expo push token: {expoPushToken}
        </Text>
        <Text style={styles.version}>Your Expo project ID: {projectId}</Text>
        <Button
          title="Register for Push Notifications"
          onPress={async () => {
            registerForPushNotificationsAsync()
              .then((token) => setExpoPushToken(token ?? ""))
              .catch((error: any) => setExpoPushToken(`${error}`));
          }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  aboutContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  version: {
    color: "grey",
    fontSize: 10,
  },
});
