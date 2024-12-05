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
          router.navigate({
            pathname: `/${pathname}`,
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
            ]}>
            {label}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export const SharePanel = (props) => {
  const { project } = props;
  const router = useRouter();

  return (
    <View style={styles.container}>
      <IconButton
        project={project}
        pathname="share"
        icon="link"
        label="share"
      />
      <IconButton
        project={project}
        pathname="calendar"
        icon="calendar-today"
        label="calendar"
      />
      <IconButton
        project={project}
        pathname="files"
        icon="file-present"
        label="files"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 16,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  button: {
    borderRadius: 12,
    width: 85,
    height: 85,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#CED0CE",
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
    fontSize: 16,
  },
});

export default SharePanel;
