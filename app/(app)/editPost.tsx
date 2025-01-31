import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Text } from "@/components/Themed";
import { useColorScheme } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import Colors from "@/constants/Colors";
import { getPost, updatePost } from "@/lib/APIpost";
import { IPost } from "@/lib/types";

export default function EditPost() {
  const colorScheme = useColorScheme();
  const local = useLocalSearchParams();
  const [post, setPost] = useState<IPost>({ caption: "" });

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
    router.back();
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
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.title}>
            <Text
              style={[
                styles.label,
                { color: Colors[colorScheme ?? "light"].textDisabledColor },
              ]}>
              Title
            </Text>
            <TextInput
              style={[
                styles.titleText,
                { color: Colors[colorScheme ?? "light"].text },
              ]}
              onChangeText={(title) => setPost({ ...post, caption: title })}
              placeholder={"Note"}
              value={post.caption}
              autoFocus={true}
              multiline={true}
              numberOfLines={10}
            />
          </View>
          <View style={styles.title}>
            <Text
              style={[
                styles.label,
                { color: Colors[colorScheme ?? "light"].textDisabledColor },
              ]}>
              Link URL
            </Text>
            <TextInput
              style={[
                styles.titleText,
                { color: Colors[colorScheme ?? "light"].text },
              ]}
              onChangeText={(linkURL) => setPost({ ...post, linkURL: linkURL })}
              placeholder={"URL"}
              value={post.linkURL}
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
  title: {
    marginBottom: 20,
  },
  label: {
    color: "lightgrey",
    marginBottom: 5,
    paddingLeft: 5,
  },
  titleText: {
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
});
