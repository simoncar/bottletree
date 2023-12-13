import { Camera, CameraType } from "expo-camera";
import React, { useState, useRef } from "react";
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

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const colorScheme = useColorScheme();
  const cameraRef = useRef();

  if (!permission) {
    // Camera permissions are still loading
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

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back,
    );
  }

  const takePhoto = async () => {
    if (!permission) return;
    if (cameraRef.current) {
      const options = { quality: 0.7 };
      const photo = await cameraRef.current.takePictureAsync(options);
      console.log(photo);
      setPreviewVisible(true);
      setCapturedImage(photo);
    }

    const photo = await Camera.takePictureAsync();
    console.log(photo);
    setPreviewVisible(true);
    setCapturedImage(photo);
  };

  function flipCameraButton() {
    return (
      <TouchableOpacity style={styles.flipCamera} onPress={takePhoto}>
        <Ionicons
          name="ios-camera-reverse-outline"
          size={45}
          color={Colors[colorScheme ?? "light"].textPlaceholder}
        />
      </TouchableOpacity>
    );
  }

  function takePhotoButton() {
    return (
      <TouchableOpacity onPress={toggleCameraType}>
        <View style={styles.circleOuter}>
          <View style={styles.circleMiddle}>
            <View style={styles.circleInner}></View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Camera ref={cameraRef.current} style={styles.camera} type={type}>
        <View style={styles.buttonRow}>
          <View style={styles.a}></View>
          <View style={styles.a}>{takePhotoButton()}</View>
          <View style={styles.a}>{flipCameraButton()}</View>
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
  toggleContainer: {
    backgroundColor: "transparent",
    margin: 64,
  },
});
