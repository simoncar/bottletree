import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  SafeAreaView,
  useColorScheme,
  Button as NativeButton,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams, Stack } from "expo-router";
import { TextInput, View } from "@/components/Themed";
import { IPost } from "@/lib/types";
import { updatePost, getPost } from "@/lib/APIpost";
import Colors from "@/constants/Colors";
import { UserContext } from "@/lib/UserContext";

export default function editPost() {
  const { user } = useContext(UserContext);
  const local = useLocalSearchParams<{
    projectId: string;
    postId: string;
  }>();

  const [post, setPost] = useState<IPost>({
    key: "",
    caption: "",
    projectId: local?.projectId || "",
    projectTitle: "",
    author: user?.displayName || "",
    images: [],
    ratio: 1,
  });

  const colorScheme = useColorScheme();

  useEffect(() => {
    if (local?.postId) {
      getPost(local?.projectId || "", local?.postId || "", (post) => {
        if (post) {
          setPost(post);
        }
      });
    }
  }, []);

  const saveDone = () => {
    router.navigate({
      pathname: "/[project]",
      params: {
        project: local?.projectId,
      },
    });
  };

  const save = () => {
    console.log("save updated post :", post);

    updatePost(post, saveDone);
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
              onChangeText={(title) => setPost({ ...post, caption: title })}
              placeholder={"Add Note"}
              value={post.caption}
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
