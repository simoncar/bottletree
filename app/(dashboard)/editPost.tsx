import React, { useContext, useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  StyleSheet,
  SafeAreaView,
  Button,
  Alert,
  useColorScheme,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { router, useLocalSearchParams, Stack } from "expo-router";
import { updatePost, deletePost } from "../../lib/APIpost";
import ProjectContext from "../../lib/projectContext";
import { TextInput, View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import { IPost, IProject } from "../../lib/types";
import { ScrollView } from "react-native-gesture-handler";

export default function editPost() {
  const { sharedDataProject } = useContext<IProject>(ProjectContext);

  const { key, image, caption, ratio } = useLocalSearchParams();
  const [text, onChangeText] = useState(caption?.toString() ?? "");
  const colorScheme = useColorScheme();
  const { width } = Dimensions.get("window");

  const saveDone = () => {
    router.push({
      pathname: "/(tabs)",
      params: {
        project: sharedDataProject.key,
        title: sharedDataProject.title,
      },
    });
  };

  const save = () => {
    console.log("save:", sharedDataProject);

    const post: IPost = {
      projectId: sharedDataProject.key,
      key: key?.toString() ?? "",
      caption: text?.toString() ?? "",
    };

    updatePost(post, saveDone);
  };

  return (
    <View
      style={{
        flex: 1,
        height: Dimensions.get("window").height,
        backgroundColor: "#010101",
      }}>
      {image && (
        <ImageZoom
          uri={image}
          style={{
            flex: 1,
            width: "100%",
            height: Dimensions.get("window").height,
            resizeMode: "contain",
          }}
        />
      )}
    </View>
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
    marginBottom: 12,
    marginTop: 12,
    width: "98%",
  },
});
