import { Camera, CameraType } from "expo-camera";
import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../constants/Colors";

export default function App() {
  const colorScheme = useColorScheme();

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  buttonRow: {
    bottom: 0,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
  },
  camera: {
    flex: 1,
  },
  circleInner: {
    backgroundColor: "white",
    borderRadius: 86 / 2, // Use half of the width and height to create a circle
    height: 86,
    width: 86, // Adjust the inner circle size as needed
  },
  circleMiddle: {
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 90 / 2, // Use half of the width and height to create a circle
    height: 90,
    justifyContent: "center",
    width: 90, // Adjust the inner circle size as needed
  },
  circleOuter: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 50, // Use half of the width and height to create a circle
    height: 100,
    justifyContent: "center",
    width: 100,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  permission: {
    textAlign: "center",
  },
  toggleContainer: {
    backgroundColor: "transparent",
    margin: 64,
  },
  toggleContainerButton: {
    alignItems: "center",
    alignSelf: "flex-end",
  },
});
