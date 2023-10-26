import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text, View } from "./components/Themed";

const ModalScreen = () => {
  function renderColor(name: string, code: string) {
    return (
      <TouchableOpacity
        key={"addProject"}
        onPress={() => {
          router.push({
            pathname: "/editCalendar",
            params: {
              xcolor: code,
              xcolorName: name,
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
        <View>{renderColor("Red", "#DB4545")}</View>
        <View>{renderColor("Orange", "#F16D44")}</View>
        <View>{renderColor("Mango", "#EDC148")}</View>
        <View>{renderColor("Avocado", "#3C9065")}</View>
        <View>{renderColor("Grass", "#49B382")}</View>
        <View>{renderColor("Surf", "#30A7E2")}</View>
        <View>{renderColor("Aubergine", "#6172BA")}</View>
        <View>{renderColor("Plum Jam", "#9F52B2")}</View>
        <View>{renderColor("Dragon Fruit", "#E085D2")}</View>
        <View>{renderColor("Mud", "#7b5656")}</View>
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
