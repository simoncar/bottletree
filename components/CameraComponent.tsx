import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState, useContext, useRef } from "react";
import {
  Button,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Animated,
  Easing,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/constants/Colors";
import { addImageFromPhoto } from "@/lib/APIimage";
import ProjectContext from "@/lib/projectContext";
import { IPost } from "@/lib/types";
import { useAuth } from "@/lib/authProvider";
import { addPostImage } from "@/lib/APIpost";
import { router } from "expo-router";
import { View, Text } from "@/components/Themed";
import Progress from "@/components/Progress";

export default function App() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();

  const colorScheme = useColorScheme();
  const [camera, setCamera] = useState(null);
  const { sharedDataProject } = useContext(ProjectContext);
  const { sharedDataUser } = useAuth();
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [backgroundColor, setBackgroundColor] = useState("#3498db");
  const [backgroundInnerColor, setBackgroundInnerColor] = useState("white");
  const cameraRef = useRef<any>(null);
  const [progress, setProgress] = useState(0);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet.
    requestPermission;
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          We need your permission to show the camera so you can take a photo.
        </Text>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const progressCallback = (progress: number) => {
    setProgress(progress);
  };

  const saveDone = () => {
    router.navigate({
      pathname: "/[project]",
      params: {
        project: sharedDataProject.key,
      },
    });
  };

  const completedCallback = (sourceDownloadURL) => {
    let ratio = 0.66666;
    const myArray = sourceDownloadURL.split("*");
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

    console.log("Camera add post: ", post);

    addPostImage(post, saveDone);
    setProgress(0);
  };

  const handlePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.6,
      duration: 250,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();

    setBackgroundColor("#b92929");
    setBackgroundInnerColor("#b92929");
  };

  const takePicture = async () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 150,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();

    if (!permission) return;

    if (cameraRef.current) {
      const options = { quality: 0.7 };
      const photo = await cameraRef.current.takePictureAsync(options);

      addImageFromPhoto(photo, "project", progressCallback, completedCallback);
    }

    setBackgroundColor("#3498db");
    setBackgroundInnerColor("white");
  };

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
    backgroundColor: backgroundColor,
  };

  const animatedInnerStyle = {
    backgroundColor: backgroundInnerColor,
  };

  return (
    <View style={styles.container}>
      <Progress progress={progress} />
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonRow}>
          <View style={styles.a}></View>
          <View style={styles.a}>
            <TouchableOpacity
              onPressIn={handlePressIn}
              onPressOut={takePicture}
              activeOpacity={1}>
              <Animated.View style={[styles.circleOuter, animatedStyle]}>
                <View style={styles.circleMiddle}>
                  <View style={[styles.circleInner, animatedInnerStyle]}></View>
                </View>
              </Animated.View>
            </TouchableOpacity>
          </View>
          <View style={styles.a}>
            <TouchableOpacity
              style={styles.flipCamera}
              onPress={toggleCameraFacing}>
              <Ionicons
                name="camera-reverse-outline"
                size={45}
                color={Colors[colorScheme ?? "light"].textPlaceholder}
              />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
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
    padding: 40,
  },
  flipCamera: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    paddingBottom: 20,
    textAlign: "center",
  },
});
