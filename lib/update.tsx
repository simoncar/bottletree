import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Pressable,
  useColorScheme,
  AppState,
  AppStateStatus,
  Animated,
  View,
  ActivityIndicator,
} from "react-native";
import { getLocales } from "expo-localization";
import { Text } from "@/components/Themed";
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
  const [loading, setLoading] = useState(false);

  // Create animation value
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Animation for press in
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  // Animation for press out
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Show whether or not we are running embedded code or an update
  const runTypeMessage = currentlyRunning.isEmbeddedLaunch
    ? "Running code from Appp Store build"
    : "Check for updates";

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        Updates.checkForUpdateAsync();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (isUpdateAvailable) {
      setShowUpdate(true);
    }
  }, [isUpdateAvailable]);

  useEffect(() => {
    if (isUpdatePending) {
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
    setLoading(true);
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      alert(`Error fetching latest update: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  if (showUpdate === false) {
    return null;
  }

  return (
    <View style={styles.updateContainer}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={fetchandRunUpdatesAsync}
          style={styles.updateButton}>
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
          {loading && <ActivityIndicator style={styles.spinner} />}
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
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
  spinner: {
    marginLeft: 10,
  },
});
