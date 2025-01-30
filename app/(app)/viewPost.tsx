import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  useColorScheme,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  PinchGestureHandler,
  PanGestureHandler,
} from "react-native-gesture-handler";
import { Stack, useLocalSearchParams } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import Colors from "@/constants/Colors";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import Toast from "react-native-root-toast";

export default function ViewPost() {
  const { image } = useLocalSearchParams<ViewParam>();
  const colorScheme = useColorScheme();
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pinchGestureHandler = (event) => {
    scale.value = event.nativeEvent.scale;
  };

  const panGestureHandler = (event) => {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const maxTranslateX = screenWidth / 2;
    const maxTranslateY = screenHeight / 2;

    const newTranslateX =
      translateX.value + event.nativeEvent.translationX * 0.1;
    const newTranslateY =
      translateY.value + event.nativeEvent.translationY * 0.1;

    translateX.value = Math.min(
      Math.max(newTranslateX, -maxTranslateX),
      maxTranslateX,
    );
    translateY.value = Math.min(
      Math.max(newTranslateY, -maxTranslateY),
      maxTranslateY,
    );
  };

  const animatedStyle = useAnimatedStyle(() => {
    // Clamp scale to minimum of 1 (100%)
    scale.value = Math.max(1, scale.value);

    return {
      transform: [
        { scale: withSpring(scale.value) },
        { translateX: withSpring(translateX.value) },
        { translateY: withSpring(translateY.value) },
      ],
    };
  });

  const downloadImage = async () => {
    try {
      // Step 1: Download the image to the file system
      const downloadResumable = FileSystem.createDownloadResumable(
        image,
        FileSystem.documentDirectory + "image.tmp",
      );
      Toast.show("Downloading...", {
        duration: Toast.durations.SHORT,
      });

      const { uri, headers } = await downloadResumable.downloadAsync();

      // Step 2: Determine the MIME type and file extension
      const contentType = headers["Content-Type"];
      let fileExtension = "";
      if (contentType === "image/jpeg") {
        fileExtension = ".jpg";
      } else if (contentType === "image/png") {
        fileExtension = ".png";
      } else if (contentType === "image/gif") {
        fileExtension = ".gif";
      } else if (contentType === "image/webp") {
        fileExtension = ".webp";
      } else {
        fileExtension = ".jpg";
      }

      const newUri = uri.replace("image.tmp", `image${fileExtension}`);
      await FileSystem.moveAsync({ from: uri, to: newUri });

      await MediaLibrary.saveToLibraryAsync(newUri);

      Toast.show("Download complete", {
        duration: Toast.durations.SHORT,
      });
    } catch (error) {
      console.error("Error downloading or saving image", error);
      Toast.show("Failed to save image: " + error, {
        duration: Toast.durations.SHORT,
      });
    }
  };
  return (
    <View style={styles.overall}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPressIn={() => {
                downloadImage();
              }}>
              <Feather
                name="download"
                size={23}
                color={Colors[colorScheme ?? "light"].text}
                bold={true}
              />
            </Pressable>
          ),
        }}
      />
      <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
        <Animated.View>
          <PanGestureHandler onGestureEvent={panGestureHandler}>
            <Animated.View style={animatedStyle as any}>
              <Image
                style={styles.image}
                source={image}
                contentFit="contain"
                transition={1000}
              />
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overall: {
    flex: 1,
    height: Dimensions.get("window").height - 200,
  },
});
