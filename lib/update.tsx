import React, { useState, useEffect } from "react";
import { StyleSheet, Pressable, useColorScheme } from "react-native";
import { getLocales } from "expo-localization";
import { Text, View } from "@/components/Themed";
import * as Application from "expo-application";
import { useSession } from "@/lib/ctx";
import { getToken } from "@/lib/APINotification";
import { auth } from "@/lib/firebase";
import * as Updates from "expo-updates";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "@/constants/Colors";

export const Update = () => {
  const { currentlyRunning, isUpdateAvailable, isUpdatePending } =
    Updates.useUpdates();
  const colorScheme = useColorScheme();
  const [showUpdate, setShowUpdate] = useState(false);

  // Show whether or not we are running embedded code or an update
  const runTypeMessage = currentlyRunning.isEmbeddedLaunch
    ? "Running code from Appp Store build"
    : "Check for updates";

  useEffect(() => {
    if (isUpdatePending) {
      // Update has successfully downloaded
      //runUpdate();
      console.log("Update has successfully downloaded");
    }
  }, [isUpdatePending]);

  useEffect(() => {
    if (__DEV__) return;
    if (isUpdateAvailable) {
      setShowUpdate(true);
    } else {
      console.log("No new update available");
    }
  }, [isUpdateAvailable]);

  async function fetchandRunUpdatesAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      alert(`Error fetching latest update: ${error}`);
    }
  }

  if (showUpdate === false) {
    return null;
  }

  return (
    <View style={styles.updateContainer}>
      <Pressable onPress={fetchandRunUpdatesAsync} style={styles.updateButton}>
        <View style={styles.iconContainer}>
          <MaterialIcons
            name="celebration"
            size={24}
            color={Colors[colorScheme ?? "light"].text}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.updateText}>Update available</Text>
          <Text style={styles.installText}>Click to install</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginLeft: 70,
    marginRight: 12,
  },
  installText: {
    color: "grey",
    fontSize: 14,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  updateButton: {
    alignItems: "center",
    borderColor: "#CED0CE",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 3,
    flexDirection: "row",
    paddingHorizontal: 16,
    padding: 8,
    width: "100%",
  },
  updateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 12,
  },
  updateText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
});
