import { LogBox } from "react-native";
import React from "react";
import { Redirect } from "expo-router";

const Index = () => {
  LogBox.ignoreLogs([
    "React does not recognize the `nativeViewRef` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `nativeviewref` instead. If you accidentally passed it from a parent component, remove it from the DOM element.",
  ]);

  console.log("Index - GO TO (tabs)");

  return <Redirect href="/11111" />;
};

export default Index;
