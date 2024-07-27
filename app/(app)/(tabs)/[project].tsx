import React, { useEffect, useContext } from "react";
import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Posts } from "@/components/Posts";
import { View, Text } from "@/components/Themed";
import { UserContext } from "@/lib/UserContext";

type SearchParams = {
  project: string;
};

export default function ProjectPosts() {
  const { project } = useLocalSearchParams<SearchParams>();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    setUser({ ...user, project: project });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.project}>{project}</Text>
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
  project: {
    color: "grey",
  },
});
