import React, { useContext, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TextInput,
  Button as NativeButton,
  useColorScheme,
} from "react-native";
import { Stack, router } from "expo-router";
import { IPost, IProject } from "../lib/types";
import ProjectContext from "../lib/projectContext";
import { useAuth } from "../lib/authProvider";
import { addPostNote } from "../lib/APIpost";
import Colors from "../constants/Colors";

export default function Note() {
  const { sharedDataProject } = useContext<IProject>(ProjectContext);
  const { sharedDataUser } = useAuth();
  const [title, onChangeTitle] = useState("");
  const colorScheme = useColorScheme();

  const saveDone = () => {
    console.log("saveDone - push to home");

    router.push({
      pathname: "/",
      params: {
        project: sharedDataProject.key,
        title: sharedDataProject.title,
      },
    });
  };

  const save = () => {
    console.log("save:", sharedDataProject);

    const post: IPost = {
      key: "",
      caption: title?.toString() ?? "",
      projectId: sharedDataProject.key,
      projectTitle: sharedDataProject.title,
      author: sharedDataUser.displayName,
    };

    addPostNote(post, saveDone);
  };

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerRight: () => (
            <NativeButton title="Done" onPress={() => save()} />
          ),
        }}
      />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.title}>
            <TextInput
              style={[
                styles.titleText,
                { color: Colors[colorScheme ?? "light"].text },
              ]}
              onChangeText={(title) => onChangeTitle(title)}
              placeholder={"Add Note"}
              value={title}
              autoFocus={true}
              multiline={true}
              numberOfLines={10}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: { flex: 1, justifyContent: "flex-start" },
  titleText: {
    fontSize: 25,
  },
});
