import React from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { View } from "@/components/Themed";
import { press } from "@testing-library/react-native/build/user-event/press";

const goBack = () => {
  router.back();
};

export const Back = () => {
  const colorScheme = useColorScheme();
  return (
    <Pressable
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 30 }}
      onPress={goBack}
      style={styles.pressable}>
      <View style={styles.titleView}>
        <FontAwesome5
          name="chevron-left"
          size={23}
          color={Colors[colorScheme ?? "light"].text}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  titleView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 20,
  },
  pressable: {
    zIndex: 10,
  },
});
