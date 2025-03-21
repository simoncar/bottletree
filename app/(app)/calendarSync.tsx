import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CalendarSync() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Calendar Sync Screen</Text>
      <Text style={styles.text}>(experimental)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
});
