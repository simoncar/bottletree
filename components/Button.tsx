import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface SignInButtonProps {
  onPress: () => void;
  label: string;
}

export function ButtonYellow({ onPress, label }: SignInButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.textLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#f97316",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    marginBottom: 10,
    width: 300,
  },
  textLabel: {
    fontSize: 18,
    color: "black",
  },
});
