import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Updates from "expo-updates";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  AppState,
  AppStateStatus,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

export const Update = () => {
  const { isUpdateAvailable, isUpdatePending } = Updates.useUpdates();
  const colorScheme = useColorScheme();
  const [showUpdate, setShowUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

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

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        if (!__DEV__) {
          Updates.checkForUpdateAsync();
        }
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

      //if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync({
        reloadScreenOptions: {
          backgroundColor: "#fa0000",
          image: require("@/assets/images/reload.png"),
          imageResizeMode: "cover",
          imageFullScreen: true,
          fade: true,
        },
      });
      //}
    } catch (error) {
      alert(`Error fetching latest update: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  if (showUpdate === false && !__DEV__) {
    return null;
  }

  return (
    <View style={styles.updateContainer}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={fetchandRunUpdatesAsync}
        style={styles.updateButton}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons
            name="celebration"
            size={24}
            color={Colors[colorScheme ?? "light"].button}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.updateText}>{t("updateAvailable")}</Text>
          <Text style={styles.installText}>{t("updateClickInstall")}</Text>
        </View>
        {loading && <ActivityIndicator style={styles.spinner} />}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 20,
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
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  updateContainer: {
    padding: 30,
  },
  updateText: {
    fontSize: 16,
  },
  spinner: {
    marginLeft: 10,
    transform: [{ scale: 1.5 }],
  },
});
