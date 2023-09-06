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

  function renderColor(name: string, code: string) {
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
              <View style={[styles.colorAvatar, { backgroundColor: code }]} />
            </View>
            <View>
              <Text style={styles.project}>{name}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.projectList}>
        <View>{renderColor("Red Rocks", "#DB4545")}</View>
        <View>{renderColor("Orange", "#F16D44")}</View>
        <View>{renderColor("Mango", "#EDC148")}</View>
        <View>{renderColor("Avocado", "#3C9065")}</View>
        <View>{renderColor("MCG Turf", "#49B382")}</View>
        <View>{renderColor("Surf", "#30A7E2")}</View>
        <View>{renderColor("Aubergine", "#6172BA")}</View>
        <View>{renderColor("Plum Jam", "#9F52B2")}</View>
        <View>{renderColor("Dragon Fruit", "#E085D2")}</View>
        <View>{renderColor("Back Pocket Mud", "#7b5656")}</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    marginRight: 12,
    width: 50,
  },

  colorAvatar: {
    borderRadius: 35 / 2,
    height: 35,
    width: 35,
  },
  container: {
    flex: 1,
    height: 200,
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

  projectList: {},
});

export default ModalScreen;
