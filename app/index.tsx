import { View, Text } from "react-native";
import React from "react";
import { Redirect } from "expo-router";

const Index = () => {
  console.log("Index - GO TO (tabs)");

  return <Redirect href="/(tabs)" />;
};

export default Index;
