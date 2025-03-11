import {
  Pressable,
  Share,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Text } from "@/components/Themed";
import { IProject } from "@/lib/types";
import Colors from "@/constants/Colors";
import { useTranslation } from "react-i18next";

type ProjectProp = {
  project: IProject;
  pathname: string;
  icon: string;
  label: string;
};

const IconButton = (props) => {
  const colorScheme = useColorScheme();
  const { project, pathname, icon, label, count } = props;
  const router = useRouter();

  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={[
          styles.button,
          { backgroundColor: Colors[colorScheme ?? "light"].postBackground },
        ]}
        onPress={() => {
          router.navigate({
            pathname: pathname,
            params: {
              project: project.key,
              title: project.title,
            },
          });
        }}>
        <View style={styles.buttonContent}>
          <View style={styles.iconContainer}>
            <MaterialIcons
              name={icon}
              color="#999999"
              style={styles.icon}
              size={28}
            />
            {count > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{count}</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.shareText,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {label}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};
export const SharePanel = (props) => {
  const { project, buttons } = props;
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {buttons.includes("calendar") && (
        <IconButton
          project={project}
          pathname="/calendar"
          icon="calendar-today"
          label={t("calendar")}
          count={0}
        />
      )}
      {buttons.includes("files") && (
        <IconButton
          project={project}
          pathname="/files"
          icon="file-present"
          label={t("files")}
          count={project.fileCount}
        />
      )}
      {buttons.includes("tasks") && (
        <IconButton
          project={project}
          pathname="/tasks"
          icon="add-task"
          label={t("tasks")}
          count={project.taskCount}
        />
      )}
      {buttons.includes("share") && (
        <IconButton
          project={project}
          pathname="/share"
          icon="share"
          label={t("share")}
          count={0}
        />
      )}
      {buttons.includes("settings") && (
        <IconButton
          project={project}
          pathname="/project/[project]"
          icon="settings"
          label={t("settings")}
          count={0}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 1,
  },
  badgeContainer: {
    position: "absolute",
    top: -10,
    right: -25,
    backgroundColor: "gray",
    borderRadius: 100,
    paddingHorizontal: 5,
    paddingVertical: 2,
    zIndex: 1,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  button: {
    borderRadius: 12,
    width: 81,
    height: 80,

    borderWidth: StyleSheet.hairlineWidth,
  },
  buttonContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: 8,
  },
  icon: {
    textAlign: "center",
  },
  shareText: {
    fontSize: 13,
  },
});

export default SharePanel;
