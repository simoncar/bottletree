import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  TextInput,
  Button as NativeButton,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { IPost } from "@/lib/types";
import { setPostNote, getPost } from "@/lib/APIpost";
import Colors from "@/constants/Colors";
import { UserContext } from "@/lib/UserContext";
import { Back } from "@/components/Back";

export default function Note() {
  const local = useLocalSearchParams<{
    project: string;
    post: string;
  }>();
  const { user } = useContext(UserContext);

  const [post, setPost] = useState<IPost>({
    key: "",
    caption: "",
    projectId: local?.project || "",
    projectTitle: "",
    author: user?.displayName || "",
    uid: user?.uid || "",
    images: [],
    ratio: 1,
  });

  const colorScheme = useColorScheme();

  useEffect(() => {
    if (local?.post) {
      getPost(local?.project || "", local?.post || "", (post) => {
        if (post) {
          setPost(post);
        }
      });
    }
  }, []);

  const saveDone = () => {
    router.navigate({
      pathname: "/[posts]",
      params: {
        posts: local?.project,
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
            <TouchableOpacity
              onPressIn={() => {
                console.log("save");
                save();
              }}>
              <Text>Save</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <TextInput
        style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
        onChangeText={(title) => setPost({ ...post, caption: title })}
        placeholder={"Add Note"}
        value={post.caption}
        autoFocus={true}
        multiline={true}
        numberOfLines={10}
      />
      <View style={styles.aboutContainer}>
        <Text style={styles.version}>{user.project}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  aboutContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  input: {
    fontSize: 20,
    height: 140,
    margin: 12,
    padding: 10,
    paddingLeft: 20,
    width: "98%",
  },
  version: {
    color: "grey",
    fontSize: 14,
  },
});
