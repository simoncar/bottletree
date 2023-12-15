import React, { useState, useContext } from "react";
import { StyleSheet, Button, SafeAreaView } from "react-native";
import { router, Stack } from "expo-router";
import { TextInput } from "../components/Themed";

import ProjectContext from "../lib/projectContext";
import AuthContext from "../lib/authContext";

import { addProject } from "../lib/APIproject";
import { IProject, IUser } from "../lib/types";

export default function addPhoto() {
  const { sharedDataProject, updateSharedDataProject } =
    useContext(ProjectContext);
  const { sharedDataUser } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [text, onChangeText] = useState("");
  let loggedInUser: IUser = sharedDataUser;

  if (null == sharedDataUser) {
    loggedInUser = {
      uid: "",
      displayName: "",
      email: "",
      photoURL: "",
    };
  }

  const project: IProject = {
    key: "",
    title: "",
    icon: "",
    archived: false,
  };

  const saveDone = (id) => {
    updateSharedDataProject({
      key: id,
      title: project.title,
      icon: project.icon,
      archived: project.archived,
    });

    router.replace({
      pathname: "/editProject",
      params: {
        projectId: id,
        projectTitle: project.title,
      },
    });
  };

  const onSave = async () => {
    project.title = text;
    addProject(project, loggedInUser, saveDone);
  };

  const pickImage = async () => {};

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
