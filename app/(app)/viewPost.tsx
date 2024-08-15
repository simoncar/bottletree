import React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  useColorScheme,
  Pressable,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { Image } from "expo-image";
import { Back } from "@/components/Back";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import Toast from "react-native-root-toast";

type ViewParam = {
  image: string;
};

const ViewPost = () => {
  const { image } = useLocalSearchParams<ViewParam>();
  const colorScheme = useColorScheme();

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
      }

      Toast.show("Content Type: " + contentType, {
        duration: Toast.durations.LONG,
      });

      console.log("File extension", fileExtension);

      const newUri = uri.replace("image.tmp", `image${fileExtension}`);
      await FileSystem.moveAsync({ from: uri, to: newUri });

      await MediaLibrary.saveToLibraryAsync(newUri);

      Toast.show("Download complete", {
        duration: Toast.durations.SHORT,
      });
    } catch (error) {
      console.error("Error downloading or saving image", error);
      // Toast.show("Failed to save image: " + contentType, {
      //   duration: Toast.durations.SHORT,
      // });
    }
  };

  return (
    <View style={styles.overall}>
      <Stack.Screen
        options={{
          headerLeft: () => <Back />,
          headerRight: () => (
            <Pressable
              onPress={() => {
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
      {image && (
        <ReactNativeZoomableView
          maxZoom={null}
          // Give these to the zoomable view so it can apply the boundaries around the actual content.
          // Need to make sure the content is actually centered and the width and height are
          // dimensions when it's rendered naturally. Not the intrinsic size.
          // For example, an image with an intrinsic size of 400x200 will be rendered as 300x150 in this case.
          // Therefore, we'll feed the zoomable view the 300x150 size.
          contentWidth={300}
          contentHeight={150}>
          <Image style={styles.imageZoom} source={image} />
        </ReactNativeZoomableView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageZoom: {
    height: Dimensions.get("window").height - 200,
    overflow: "hidden",
    resizeMode: "contain",
    width: Dimensions.get("window").width,
  },
  overall: {
    backgroundColor: "#010101",
    flex: 1,
    height: Dimensions.get("window").height - 200,
  },
});

export default ViewPost;
