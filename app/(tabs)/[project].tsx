import React from "react";
import { StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Posts } from "@/components/Posts";
import { View } from "@/components/Themed";
import { getUser } from "@/lib/APIuser";
import { auth, firestore } from "@/lib/firebase";
import { useAuth } from "@/lib/authProvider";

export default function ProjectPosts() {
  const { project } = useLocalSearchParams();
  let dbProject = project;
  if (project == "welcome") {
    getUser(auth().currentUser.uid || "", (user) => {
      if (user) {
        console.log("index user: ", user);
        //if user.project has a value then set the project variable to that value
        if (user.project) {
          dbProject = user.project;
          console.log("index dbProject: ", dbProject);
          console.log("VVVV");

          router.navigate({
            pathname: "/[project]",
            params: {
              project: dbProject,
            },
          });
        }
      } else {
        console.log("no user :-(");
      }
    });
  }

  return (
    <View style={styles.container}>
      <Posts project={dbProject as string} />
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
