import React, { useState, useEffect } from "react";
import { StyleSheet, Pressable } from "react-native";
import { getLocales } from "expo-localization";
import { Text, View } from "@/components/Themed";
import * as Application from "expo-application";
import { useSession } from "@/lib/ctx";
import { getToken } from "@/lib/APINotification";
import { auth } from "@/lib/firebase";
import * as Updates from "expo-updates";

export const Update = () => {
  const { currentlyRunning, isUpdateAvailable, isUpdatePending } =
    Updates.useUpdates();

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

  return (
    <View style={styles.aboutContainer}>
      <Pressable onPress={fetchandRunUpdatesAsync}>
        <Text style={styles.version}>
          Update Pending: {isUpdatePending.toString()}
        </Text>
        <Text style={styles.version}>
          Update Available : {isUpdateAvailable.toString()}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  aboutContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  version: {
    color: "grey",
    fontSize: 14,
  },
});
