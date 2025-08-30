import { Posts } from "@/components/Posts";
import { View } from "@/components/Themed";
import { getProject } from "@/lib/APIproject";
import { IProject } from "@/lib/types";
import { UserContext } from "@/lib/UserContext";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

type SearchParams = {
  posts: string; //project ID
  title: string;
  icon: string;
};

export default function ProjectPosts() {
  const { posts: project, title, icon } = useLocalSearchParams<SearchParams>();
  const { user, setUser } = useContext(UserContext);
  const [projectObj, setProject] = useState<IProject>({
    project: "",
    key: "",
    title: title,
    icon: icon || "",
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
  }, [project, setUser, user]);

  if (!projectObj) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Posts
          project={project as string}
          title={title as string}
          icon={icon as string}
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
