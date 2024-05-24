import React from "react";
import { StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Posts } from "@/components/Posts";
import { View } from "@/components/Themed";
import { getUser } from "@/lib/APIuser";
import { auth } from "@/lib/firebase";
import { IUser } from "@/lib/types";
import { useAuth } from "@/lib/authProvider";

export default function ProjectPosts() {
  const { project } = useLocalSearchParams();
  const { sharedDataUser } = useAuth();

  const dbProject = project;

  const loggedInUser: IUser = sharedDataUser ?? {
    uid: "",
    displayName: "",
    email: "",
    photoURL: "",
    project: "",
  };

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
