import React from "react";
import { StyleSheet, TouchableOpacity, Text, ViewStyle } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

type FloatingButtonProps = {
  onPress: () => void;
  title?: string;
  style?: ViewStyle;
  icon?: JSX.Element;
};

export function FloatingButton({
  onPress,
  title = "Add File",
  style,
  icon,
}: FloatingButtonProps) {
  return (
    <TouchableOpacity style={[styles.floatingButton, style]} onPress={onPress}>
      {icon ? icon : <AntDesign name="addfile" size={28} color="#ffffff" />}
      {title ? <Text style={styles.floatingButtonText}>{title}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "grey",
    width: 150,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  floatingButtonText: {
    color: "#ffffff",
    fontSize: 20,
    marginLeft: 10,
  },
});
