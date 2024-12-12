import React, { useEffect, useState } from "react";
import { Back } from "@/components/Back";
import { useNavigation, Slot } from "expo-router";
import { Pressable, useColorScheme, StyleSheet, View } from "react-native";

export default function ProjectLayout() {
  const navigation = useNavigation();

  useEffect(() => {
    setNavOptions();
  }, []);

  const setNavOptions = () => {
    navigation.setOptions({
      headerLeft: () => <Back />,
    });
  };

  return <Slot />;
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 33,
    fontWeight: "bold",
    paddingLeft: 5,
  },
  tabButton: {
    alignItems: "center",
    backgroundColor: "#5D5CE7",
    borderRadius: 100,
    justifyContent: "center",
    width: 30,
  },
  tabIcon: {
    paddingBottom: 0,
    paddingLeft: 1,
  },
  back: {
    paddingLeft: 10,
  },
});
