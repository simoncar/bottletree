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
  title = "",
  style,
  icon,
}: FloatingButtonProps) {
  // Calculate button width based on translation string length
  const buttonWidth = Math.min(200, Math.max(180, title.length * 10 + 60));

  return (
    <TouchableOpacity
      style={[styles.floatingButton, style, { width: buttonWidth }]}
      onPress={onPress}>
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
    width: 180,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    zIndex: 10,
  },
  floatingButtonText: {
    color: "#ffffff",
    fontSize: 20,
    marginLeft: 10,
  },
});
