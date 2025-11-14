import React from "react";
import {
  StyleSheet,
  View,
  useColorScheme,
  Pressable,
  Alert,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import Toast from "react-native-root-toast";
import PinchableImage from "@/components/PinchableImage";
import { useTranslation } from "react-i18next";

type ViewParam = {
  image: string;
  width: number;
  height: number;
};

const ViewPost = () => {
  const { image, width, height } = useLocalSearchParams<ViewParam>();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const downloadImage = async () => {
    try {
      // Step 1: Download the image to the file system
      const downloadResumable = FileSystem.createDownloadResumable(
        image,
        FileSystem.documentDirectory + "image.tmp",
      );
      Toast.show(t("downloading"), {
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

      Toast.show(t("completed"), {
        duration: Toast.durations.SHORT,
      });
      Alert.alert(t("completed"));
    } catch (error) {
      console.error("Error downloading or saving image", error);
      Toast.show(t("failed") + ":" + error, {
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
              }}
            >
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
        <View style={{ flex: 1 }}>
          <PinchableImage source={image} width={width} height={height} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overall: {
    backgroundColor: "#010101",
    flex: 1,
  },
});

export default ViewPost;
