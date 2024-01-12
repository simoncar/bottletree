import React from "react";

import {
  Dimensions,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import { View, Text, ParsedText } from "@/components/Themed";
import Colors from "@/constants/Colors";

export const ColorRow = ({ onPress, selectedColor }) => {
  function renderColor(name: string, code: string) {
    return (
      <Pressable
        key={"addProject"}
        onPress={() => {
          onPress(name, code);
        }}>
        <View style={styles.avatar}>
          <View style={[styles.colorAvatar, { backgroundColor: code }]} />
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.itemView}>
      <View>{renderColor("Red", "#DB4545")}</View>
      <View>{renderColor("Orange", "#F16D44")}</View>
      <View>{renderColor("Mango", "#EDC148")}</View>
      <View>{renderColor("Avocado", "#3C9065")}</View>
      <View>{renderColor("Grass", "#49B382")}</View>
      <View>{renderColor("Blue", "#30A7E2")}</View>
      <View>{renderColor("Aubergine", "#6172BA")}</View>
      <View>{renderColor("Plum Jam", "#9F52B2")}</View>
      <View>{renderColor("Dragon Fruit", "#E085D2")}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: { alignItems: "center", justifyContent: "flex-start", width: 45 },
  colorAvatar: {
    borderRadius: 35 / 2,
    height: 35,
    width: 35,
  },
  itemView: {
    alignItems: "center",
    flexDirection: "row",
    height: 80,
    paddingVertical: 8,
  },
});

export default ColorRow;
