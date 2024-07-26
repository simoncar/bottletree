import React, { useState, useContext } from "react";
import { StyleSheet, Button, SafeAreaView } from "react-native";
import { router, Stack } from "expo-router";
import { TextInput } from "@/components/Themed";
import { useSession } from "@/lib/ctx";

import { addProject, addProjectUser } from "@/lib/APIproject";
import { IProject, IUser } from "@/lib/types";
import { useProject } from "@/lib/projectProvider";
import { UserContext } from "@/lib/UserContext";

export default function addPhoto() {
  const { sharedDataProject, updateStoreSharedDataProject } = useProject();
    const { user } = useContext(UserContext);
  const { session } = useSession();
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [text, onChangeText] = useState("");
  
  let loggedInUser: IUser = user;

  if (null == session) {
    loggedInUser = {
      uid: "",
      displayName: "",
      email: "",
      photoURL: "",
      project: "",
    };
  }

  const project: IProject = {
    key: "",
    title: "",
    icon: "",
    archived: false,
    postCount: 0,
    project: ""
  };

  const saveDoneUser = (projectId: string) => {
    router.replace({
      pathname: "/project/[project]",
      params: {
        project: projectId,
        projectTitle: project.title,
      },
    });
  };

  const saveDone = (id: string) => {
    updateStoreSharedDataProject({
      key: id,
      title: project.title,
      icon: project.icon,
      archived: project.archived,
    });

    addProjectUser(id, loggedInUser, saveDoneUser);
  };

  const onSave = async () => {
    project.title = text;
    console.log("addProject: ", text, project.title, loggedInUser.uid);

    addProject(project, loggedInUser, saveDone);
  };

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerRight: () => <Button title="Next" onPress={() => onSave()} />,
        }}
      />

      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangeText(text)}
        placeholder={"Write Project Name..."}
        value={text}
        autoFocus={true}
        multiline
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 20,
    height: 140,
    margin: 12,
    padding: 10,
    paddingLeft: 20,
    width: "98%",
  },
});
