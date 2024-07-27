import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Button as NativeButton,
  useColorScheme,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { IPost } from "@/lib/types";
import { setPostNote, getPost } from "@/lib/APIpost";
import Colors from "@/constants/Colors";
import { UserContext } from "@/lib/UserContext";

export default function Note() {
  const local = useLocalSearchParams<{
    projectId: string;
    postId: string;
  }>();
  const { user } = useContext(UserContext);

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
        <View style={styles.aboutContainer}>
          <Text style={styles.version}>{user.project}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  aboutContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: { flex: 1, justifyContent: "flex-start" },
  titleText: {
    fontSize: 25,
  },
  version: {
    color: "grey",
    fontSize: 14,
  },
});
