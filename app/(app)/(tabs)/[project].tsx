import React, { useEffect, useState, useContext } from "react";
import { StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Posts } from "@/components/Posts";
import { View } from "@/components/Themed";
import { UserContext } from "@/lib/UserContext";
import { getProject } from "@/lib/APIproject";

type SearchParams = {
  project: string;
};

export default function ProjectPosts() {
  const { project } = useLocalSearchParams<SearchParams>();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    getProject(project, (projectObj) => {
      if (projectObj) {
        console.log("ProjectPosts: project found: " + project);
      } else {
        console.log("ProjectPosts: project not found: " + project);
        router.replace("/signIn");
      }
    });

    setUser({ ...user, project: project });
  }, []);

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
