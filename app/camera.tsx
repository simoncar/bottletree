import { Camera, CameraType } from "expo-camera";
import React, { useState, useContext } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../constants/Colors";
import { addImageFromPhoto } from "../lib/APIimage";
import ProjectContext from "../lib/projectContext";
import { IPost } from "../lib/types";
import { useAuth } from "../lib/authProvider";
import { addPostImage } from "../lib/APIpost";
import { router } from "expo-router";

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const colorScheme = useColorScheme();
  const [camera, setCamera] = useState(null);
  const { sharedDataProject } = useContext(ProjectContext);
  const { sharedDataUser } = useAuth();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.permission}>
          We need your permission to show the camera
        </Text>
        <Button
          onPress={requestPermission}
          title="Grant Permission to use the Camera"
        />
      </View>
    );
  }

  function flipCamera() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back,
    );
  }

  const progressCallback = (progress) => {
    console.log("progressCallback CAMERA : " + progress);
  };

  const saveDone = () => {
    console.log("saveDone - push to home");

    router.push({
      pathname: "/",
      params: {
        project: sharedDataProject.key,
        title: sharedDataProject.title,
      },
    });
  };

  const completedCallback = (sourceDownloadURL) => {
    console.log("addImageCallback CAMERA >>>>>>>: ", sourceDownloadURL);
    let ratio = 0.66666;
    const myArray = sourceDownloadURL.split("*");
    console.log("myArray: ", myArray);
    if (myArray[0] > ratio) {
      ratio = myArray[0];
    }
    const downloadURL = myArray[1]; // For example, creating a new array with each element doubled.

    //setImage(null);

    const post: IPost = {
      key: "",
      caption: "",
      projectId: sharedDataProject.key,
      projectTitle: sharedDataProject.title,
      author: sharedDataUser.displayName,
      images: [downloadURL],
      ratio: ratio,
    };

    console.log(post);

    addPostImage(post, saveDone);
    //setProgress(0);
  };

  const takePhoto = async () => {
    if (!permission) return;

    if (camera) {
      const options = { quality: 0.7 };
      const photo = await camera.takePictureAsync(options);

      addImageFromPhoto(photo, "project", progressCallback, completedCallback);
    }
  };

  return (
    <View style={styles.container}>
      <Camera ref={(ref) => setCamera(ref)} style={styles.camera} type={type}>
        <View style={styles.buttonRow}>
          <View style={styles.a}></View>
          <View style={styles.a}>
            <TouchableOpacity onPress={takePhoto}>
              <View style={styles.circleOuter}>
                <View style={styles.circleMiddle}>
                  <View style={styles.circleInner}></View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.a}>
            <TouchableOpacity style={styles.flipCamera} onPress={flipCamera}>
              <Ionicons
                name="ios-camera-reverse-outline"
                size={45}
                color={Colors[colorScheme ?? "light"].textPlaceholder}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  a: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 40,
  },
  buttonRow: {
    bottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
  },
  camera: {
    flex: 1,
  },
  circleInner: {
    backgroundColor: "white",
    borderRadius: 86 / 2, // Use half of the width and height to create a circle
    height: 86,
    width: 86, // Adjust the inner circle size as needed
  },
  circleMiddle: {
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 90 / 2, // Use half of the width and height to create a circle
    height: 90,
    justifyContent: "center",
    width: 90, // Adjust the inner circle size as needed
  },
  circleOuter: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 50, // Use half of the width and height to create a circle
    height: 100,
    justifyContent: "center",
    width: 100,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  flipCamera: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  permission: {
    textAlign: "center",
  },
});
