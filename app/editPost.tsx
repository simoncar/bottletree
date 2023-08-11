import React, { useContext, useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  StyleSheet,
  SafeAreaView,
  Button,
  Alert,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams, Stack } from "expo-router";
import { updatePost, deletePost } from "../lib/APIpost";
import ProjectContext from "../lib/projectContext";
import { TextInput, View } from "../components/Themed";
import Colors from "../constants/Colors";
import { IPost, IProject } from "../lib/types";
import { ScrollView } from "react-native-gesture-handler";

export default function editPost() {
  const { sharedDataProject } = useContext<IProject>(ProjectContext);

  const { key, image, caption } = useLocalSearchParams();
  const [text, onChangeText] = useState(caption?.toString() ?? "");
  const colorScheme = useColorScheme();

  const saveDone = () => {
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
    console.log("sharedDataProject.key:", sharedDataProject.key);
    console.log("sharedDataProject.caption:", sharedDataProject.title);

    const post: IPost = {
      projectId: sharedDataProject.key,
      key: key?.toString() ?? "",
      caption: text?.toString() ?? "",
    };

    updatePost(post, saveDone);
  };

  const onDelete = () => {
    Alert.alert(
      "Delete",
      "Are you sure?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deletePost(
              {
                projectId: sharedDataProject.key,
                key: key?.toString() ?? "",
                caption: text?.toString() ?? "",
              },
              saveDone,
            );
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerRight: () => <Button title="Done" onPress={() => save()} />,
        }}
      />
      <ScrollView>
        <View style={styles.descriptionView}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => onChangeText(text)}
            placeholder={"Write a caption..."}
            value={text}
            autoFocus
            multiline
            textAlignVertical="top"
          />
        </View>
        {image && <Image source={image} style={styles.storyPhoto} />}
        <View style={styles.outerView}>
          <View style={styles.leftContent}></View>
          <TouchableOpacity onPress={onDelete}>
            <View style={styles.rightChevron}>
              <FontAwesome5
                name="trash-alt"
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  descriptionView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 8,
    padding: 8,
  },
  input: {
    fontSize: 20,
    margin: 12,
    padding: 10,
    paddingLeft: 20,
    width: "98%",
  },
  leftContent: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 8,
  },
  outerView: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    paddingVertical: 8,
    padding: 8,
  },
  rightChevron: {
    marginHorizontal: 8,
  },

  storyPhoto: {
    alignSelf: "center",
    borderColor: "lightgray",
    height: 300,
    marginBottom: 12,
    marginTop: 12,
    width: "98%",
  },
});
