import React, { useEffect, useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Posts } from "@/components/Posts";
import { View, Text } from "@/components/Themed";
import { UserContext } from "@/lib/UserContext";
import { getProject } from "@/lib/APIproject";
import { IProject } from "@/lib/types";

type SearchParams = {
  posts: string; //project ID
  title: string;
};

export default function ProjectPosts() {
  const { posts: project, title } = useLocalSearchParams<SearchParams>();
  const { user, setUser } = useContext(UserContext);
  const [projectObj, setProject] = useState<IProject>({
    project: "",
    key: "",
    title: title,
    icon: "",
    archived: false,
    postCount: 0,
    private: false,
  });

  console.log("/(app)/(tabs)/[posts].tsx");

  useEffect(() => {
    getProject(project, (pObj) => {
      if (pObj) {
        setProject(pObj);
        setUser({ ...user, project: project });
      } else {
        router.replace("/signIn");
      }
    });
  }, []);

  if (!projectObj) {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Posts
          project={project as string}
          title={title as string}
          projectObj={projectObj}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
