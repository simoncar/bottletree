import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { addPostImage } from "@/lib/APIpost";
import { addImageFromCameraRoll } from "@/lib/APIimage";
import ProjectContext from "@/lib/projectContext";
import { IPost } from "@/lib/types";
import { useSession } from "@/lib/ctx";
import * as Progress from "react-native-progress";
import { UserContext } from "@/lib/UserContext";

export default function addPhoto() {
  const { sharedDataProject } = useContext(ProjectContext);
  const [image, setImage] = useState(null);
  const { user } = useContext(UserContext);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    pickImage();
  }, []);

  const saveDone = () => {
    router.navigate({
      pathname: "/(tabs)",
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

  const completedCallback = (sourceDownloadURLarray) => {
    let ratio = 0.66666;
    const downloadURLarray = sourceDownloadURLarray.map((element) => {
      const myArray = element.split("*");
      if (myArray[0] > ratio) {
        ratio = myArray[0];
      }

      return myArray[1]; // For example, creating a new array with each element doubled.
    });

    setImage(null);

    const post: IPost = {
      key: "",
      caption: "",
      projectId: sharedDataProject.key,
      projectTitle: sharedDataProject.title,
      author: user.displayName,
      images: downloadURLarray,
      ratio: ratio,
    };

    addPostImage(post, saveDone);
    setProgress(0);
  };

  const pickImage = async () => {
    const multiple = true;

    addImageFromCameraRoll(
      multiple,
      "posts",
      progressCallback,
      completedCallback,
    );
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
