import React from "react";
import { View, Text } from "@/components/Themed";
import { Pressable, Share, StyleSheet, useColorScheme } from "react-native";
import Colors from "@/constants/Colors";

export default function Nothing()
{
	  const colorScheme = useColorScheme();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={[
          styles.comingSoon,
          { color: Colors[colorScheme ?? "light"].text },
        ]}>
        Coming soon
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  comingSoon: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
