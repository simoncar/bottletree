import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useContext, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View, Button } from "../components/Themed";
import { addPost } from "../lib/APIpost";
import { addImage } from "../lib/APIimage";
import ProjectContext from "../lib/projectContext";
import { IPost } from "../lib/types";
import * as Progress from "react-native-progress";

export default function addPhoto() {
  const { sharedDataProject } = useContext(ProjectContext);

  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const saveDone = () => {
    router.push({
      pathname: "/",
      params: {
        project: sharedDataProject.key,
        title: sharedDataProject.title,
      },
    });
  };

  const renderProgress = (progress: number) => {
    if (progress && progress > 0) {
      return (
        <View style={styles.progressContainer}>
          <Text>Upload Progress : {progress}%</Text>
          <Progress.Bar
            progress={progress / 100}
            width={200}
            borderWidth={0}
            unfilledColor="#E5E5E5"
          />
        </View>
      );
    } else {
      return;
    }
  };

  const renderButtonImage = (progress: number) => {
    if (null == image && progress == 0) {
      return (
        <TouchableOpacity
          key={"pickImage"}
          onPress={() => {
            pickImage();
          }}
          style={styles.button}>
          <Text style={styles.buttonText}>Pick an image from camera roll</Text>
        </TouchableOpacity>
      );
    } else {
      return;
    }
  };

  const progressCallback = (progress: number) => {
    setProgress(progress);
  };
  const addImageCallback = (downloadURL: string) => {
    console.log("addImageCallback: ", downloadURL);

    setImage(null);

    const post: IPost = {
      key: "",
      caption: "",
      projectId: sharedDataProject.key,
      images: [downloadURL],
    };

    addPost(post, saveDone);
    setProgress(0);
  };

  const pickImage = async () => {
    const multiple = true;

    addImage(multiple, progressCallback, addImageCallback);
  };

  if (undefined === sharedDataProject.key || "" === sharedDataProject.key) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Select a Project first and then try again.
        </Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {renderButtonImage(progress)}
        {renderProgress(progress)}
        {image && <Image source={image} style={styles.storyPhoto} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#2196F3",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    marginTop: 40,
    width: "80%",
  },
  buttonText: {
    color: "white",
  },

  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },

  progressContainer: {
    padding: 20,
  },
  storyPhoto: {
    alignSelf: "center",
    borderColor: "lightgray",
    height: 200,
    marginBottom: 12,
    width: "98%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
