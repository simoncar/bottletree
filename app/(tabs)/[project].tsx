import React from "react";
import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Posts } from "../../components/Posts";
import { View } from "../../components/Themed";

export default function ProjectPosts() {
  const { project } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Posts project={project as string} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
