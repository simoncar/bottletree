import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import React, { useState, useContext, useRef } from "react";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Animated,
  Easing,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/constants/Colors";
import { addImageFromPhoto } from "@/lib/APIimage";
import { IPost } from "@/lib/types";
import { addPostImage } from "@/lib/APIpost";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { View, Text } from "@/components/Themed";
import Progress from "@/components/Progress";
import * as Linking from "expo-linking";
import { UserContext } from "@/lib/UserContext";
import { Back } from "@/components/Back";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  const colorScheme = useColorScheme();
  const { user } = useContext(UserContext);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [backgroundColor, setBackgroundColor] = useState("#3498db");
  const [backgroundInnerColor, setBackgroundInnerColor] = useState("white");
  const cameraRef = useRef<any>(null);
  const [progress, setProgress] = useState(0);

  const local = useLocalSearchParams<{
    project: string;
    post: string;
  }>();

  const openSettings = () => {
    Linking.openSettings();
  };

  if (!permission) {
    // Camera permissions are still loading.
    console.log("Camera permissions are still loading.");
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    console.log("Camera permissions are not granted yet > requestPermission");

    requestPermission();
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          We need your permission to show the camera so you can take photos.
        </Text>
        <Pressable
          onPress={() => {
            openSettings();
          }}>
          <Text style={styles.text}>
            Open settings to enable camera permissions.
          </Text>
        </Pressable>
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
        project: local.project,
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
      projectId: local.project,
      projectTitle: local.project,
      author: user.displayName,
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
      <Stack.Screen
        options={{
          headerLeft: () => <Back />,
        }}
      />
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
    borderRadius: 86 / 2,
    height: 86,
    width: 86,
  },
  circleMiddle: {
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 90 / 2,
    height: 90,
    justifyContent: "center",
    width: 90,
  },
  circleOuter: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 50,
    height: 100,
    justifyContent: "center",
    width: 100,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 0,
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
