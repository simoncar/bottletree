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

type ProjectProp = {
  project: IProject;
  pathname: string;
  icon: string;
  label: string;
};

const IconButton = (props) => {
  const colorScheme = useColorScheme();
  const { project, pathname, icon, label } = props;
  const router = useRouter();

  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={[
          styles.button,
          { backgroundColor: Colors[colorScheme ?? "light"].postBackground },
        ]}
        onPress={() => {
          console.log("IconButton: ", pathname, project);
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

  return (
    <View style={styles.container}>
      {buttons.includes("calendar") && (
        <IconButton
          project={project}
          pathname="/calendar"
          icon="calendar-today"
          label="calendar"
        />
      )}
      {buttons.includes("files") && (
        <IconButton
          project={project}
          pathname="/files"
          icon="file-present"
          label="files"
        />
      )}
      {buttons.includes("tasks") && (
        <IconButton
          project={project}
          pathname="/tasks"
          icon="add-task"
          label="tasks"
        />
      )}
      {buttons.includes("share") && (
        <IconButton
          project={project}
          pathname="/share"
          icon="share"
          label="share"
        />
      )}
      {buttons.includes("settings") && (
        <IconButton
          project={project}
          pathname="/project/[project]"
          icon="settings"
          label="settings"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 5,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  button: {
    borderRadius: 12,
    width: 80,
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
    fontSize: 15,
    fontFamily: "Inter_100",
  },
});

export default SharePanel;
