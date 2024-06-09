import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TextInput,
  Button as NativeButton,
  useColorScheme,
} from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { IPost, IProject } from "@/lib/types";
import { useAuth } from "@/lib/authProvider";
import { setPostNote, getPost } from "@/lib/APIpost";
import Colors from "@/constants/Colors";

export default function Note() {
  const local = useLocalSearchParams<{
    projectId: string;
    postId: string;
  }>();
  const { sharedDataUser } = useAuth();

  const [post, setPost] = useState<IPost>({
    key: "",
    caption: "",
    projectId: local?.projectId || "",
    projectTitle: "",
    author: sharedDataUser?.displayName || "",
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
    if (post.key == "") {
      post.key = "post_" + Date.now();
    }

    setPostNote(post, saveDone);
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
