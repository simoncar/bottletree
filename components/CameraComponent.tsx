import { Camera, CameraType } from "expo-camera";
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
import { View, Text, ParsedText } from "@/components/Themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const colorScheme = useColorScheme();
  const [camera, setCamera] = useState(null);
  const { sharedDataProject } = useContext(ProjectContext);
  const { sharedDataUser } = useAuth();
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [backgroundColor, setBackgroundColor] = useState("#3498db");
  const [backgroundInnerColor, setBackgroundInnerColor] = useState("white");

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

    router.navigate({
      pathname: "/(tabs)",
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

    addPostImage(post, saveDone);
    //setProgress(0);
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

  const handlePressOut = async () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 150,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();

    if (!permission) return;

    if (camera) {
      const options = { quality: 0.7 };
      const photo = await camera.takePictureAsync(options);

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
      <Camera
        ref={(ref) => setCamera(ref)}
        style={styles.camera}
        type={type}
        useCamera2Api
        autoFocus={true}>
        <View style={styles.buttonRow}>
          <View style={styles.a}></View>
          <View style={styles.a}>
            <TouchableOpacity
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={1}>
              <Animated.View style={[styles.circleOuter, animatedStyle]}>
                <View style={styles.circleMiddle}>
                  <View style={[styles.circleInner, animatedInnerStyle]}></View>
                </View>
              </Animated.View>
            </TouchableOpacity>
          </View>
          <View style={styles.a}>
            <TouchableOpacity style={styles.flipCamera} onPress={flipCamera}>
              <Ionicons
                name="camera-reverse-outline"
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
