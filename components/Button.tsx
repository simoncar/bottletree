import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface SignInButtonProps {
  onPress: () => void;
  label: string;
}

export function Button({ onPress, label }: SignInButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.loginText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#F9D96B",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    marginBottom: 10,
    width: 300,
  },
  loginText: {
    fontSize: 18,
    color: "black",
  },
});
