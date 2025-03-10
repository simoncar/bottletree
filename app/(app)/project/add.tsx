import React, { useState, useContext } from "react";
import { StyleSheet, Button, SafeAreaView } from "react-native";
import { router, Stack } from "expo-router";
import { TextInput } from "@/components/Themed";
import { useSession } from "@/lib/ctx";
import { addProject, addProjectUser } from "@/lib/APIproject";
import { IProject, IUser } from "@/lib/types";
import { UserContext } from "@/lib/UserContext";
import { Back } from "@/components/Back";
import { About } from "@/lib/about";
import { useTranslation } from "react-i18next";

export default function addNewProject() {
  const { user } = useContext(UserContext);
  const { session } = useSession();
  const [text, onChangeText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useTranslation();

  let loggedInUser: IUser = user;

  if (null == session) {
    loggedInUser = {
      uid: "",
      displayName: "",
      email: "",
      photoURL: "",
      project: "",
      anonymous: true,
    };
  }

  const project: IProject = {
    key: "",
    title: "",
    icon: "",
    archived: false,
    postCount: 0,
    project: "",
    private: false,
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
    addProjectUser(id, loggedInUser, saveDoneUser);
  };

  const onSave = async () => {
    setIsSaving(true);
    project.title = text;
    console.log("addNewProject - onSave", project, loggedInUser);
    addProject(project, loggedInUser, saveDone);
  };

  return (
    <SafeAreaView>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangeText(text)}
        placeholder={t('writeProjectName')}
        value={text}
        autoFocus={true}
        multiline
      />
      <Button
        title={isSaving ? t('saving') : t('next')}
        onPress={async () => {
          if (isSaving) return;
          setIsSaving(true);
          try {
            await onSave();
          } finally {
            //setIsSaving(false);
          }
        }}
        disabled={isSaving}
      />
      <About />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 22,
    height: 140,
    margin: 12,
    padding: 10,
    paddingLeft: 20,
    width: "98%",
  },
});
