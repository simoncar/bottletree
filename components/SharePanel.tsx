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

type ProjectProp = {
  project: IProject;
};

const SharePanel = (props: ProjectProp) => {
  const { project } = props;
  const router = useRouter();

  return (
    <View style={[styles.outerView, { paddingTop: 10 }]}>
      <Pressable
        style={styles.pressableLeft}
        onPress={() => {
          router.navigate({
            pathname: "/share",
            params: { project: project.key },
          });
        }}>
        <View style={styles.avatar}>
          <View style={styles.avatarFace}>
            <MaterialIcons
              name="link"
              color="#999999"
              style={styles.avatarIcon}
            />
          </View>
        </View>
      </Pressable>
      <Pressable
        onPress={() => {
          router.navigate({
            pathname: "/share",
            params: {
              project: project.key,
              title: project.title,
            },
          });
        }}>
        <View>
          <Text style={styles.shareText}>Share</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    textAlign: "center",
    width: 48,
  },
  avatarFace: { borderRadius: 48 / 2, height: 48, width: 48 },
  avatarIcon: {
    fontSize: 25,
    paddingTop: 10,
    textAlign: "center",
  },

  outerView: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    flexDirection: "row",
    paddingVertical: 8,
    padding: 8,
  },
  pressableLeft: {
    alignItems: "center",
    width: 50,
  },
  shareText: {
    fontSize: 20,
    paddingLeft: 20,
  },
});

export default SharePanel;
