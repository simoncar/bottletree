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
import { Stack } from "expo-router";
import { IPost, IProject } from "../lib/types";
import ProjectContext from "../lib/projectContext";
import { addPost } from "../lib/APIpost";

export default function Note() {
  const { sharedDataProject } = useContext<IProject>(ProjectContext);
  const [title, onChangeTitle] = useState("");
  const colorScheme = useColorScheme();

  const save = () => {
    console.log("save:", sharedDataProject);

    const post: IPost = {
      projectId: sharedDataProject.key,
      caption: text?.toString() ?? "",
    };

    addPost(post, saveDone);
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
              style={styles.titleText}
              onChangeText={(title) => onChangeTitle(title)}
              placeholder={"Add Note"}
              value={title}
              autoFocus={true}
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
