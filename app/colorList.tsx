import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import { ShortList } from "../components/sComponent";
import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import { getProjects } from "../lib/APIproject";
import ProjectContext from "../lib/projectContext";
import { IProject } from "../lib/types";

const ModalScreen = (props) => {
  const { color } = useLocalSearchParams<{
    color: string;
  }>();

  const colorScheme = useColorScheme();
  const { updateSharedDataProject } = useContext(ProjectContext);

  function renderColor(myColor: string) {
    return (
      <TouchableOpacity
        key={"addProject"}
        onPress={() => {
          router.push({
            pathname: "/editCalendar",
            params: {
              project: "post.projectId",
            },
          });
        }}>
        <View style={styles.outerView}>
          <View style={styles.innerView}>
            <View style={styles.avatar}>
              <View style={styles.colorAvatar} />
            </View>
            <View>
              <Text style={styles.project}>Blue</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.projectList}>
        <View>{renderColor("red")}</View>
        <View>{renderColor("blue")}</View>
        <View>{renderColor("green")}</View>
        <View>{renderColor("yellow")}</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    marginRight: 12,
    width: 50,
  },

  avatarFace: { borderRadius: 48 / 2, height: 48, width: 48 },
  container: {
    flex: 1,
    height: 200,
  },
  colorAvatar: {
    borderRadius: 35 / 2,
    height: 35,
    width: 35,
    backgroundColor: "blue",
  },
  innerView: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",

    paddingHorizontal: 8,
  },
  outerView: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    height: 80,
    paddingVertical: 8,
    padding: 8,
  },

  project: {
    fontSize: 18,
    marginBottom: 5,
  },
  projectArchived: {
    color: "grey",
    fontSize: 18,
    marginBottom: 5,
  },
  projectList: {},

  rightChevron: {
    marginHorizontal: 8,
  },
});

export default ModalScreen;
