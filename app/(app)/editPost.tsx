import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/Themed";
import { Stack, router, useLocalSearchParams } from "expo-router";
import Colors from "@/constants/Colors";
import { getPost, updatePost } from "@/lib/APIpost";
import { IPost } from "@/lib/types";
import { addImageFromCameraRoll } from "@/lib/APIimage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import { ImageGrid } from "@/components/Image";
import { t } from "i18next";

export default function EditPost() {
  const colorScheme = useColorScheme();
  const local = useLocalSearchParams();
  const [post, setPost] = useState<IPost>({ caption: "" });

  useEffect(() => {
    if (local?.postId) {
      getPost(local?.projectId || "", local?.postId || "", (post) => {
        if (post) {
          setPost(post);
          console.log("Edit Post", post);
        }
      });
    }
  }, []);

  const saveDone = () => {
    router.back();
  };

  const saveComplete = () => {
    console.log("save Completed");
  };

  const save = () => {
    console.log("save updated post :", post);
    updatePost(post, saveDone);
  };

  const progressCallback = (progress: number) => {
    console.log("progressCallback", progress);
    Toast.show({
      type: "success",
      text1: "Uploading : " + progress + "%",
      text2: "Your image is being uploaded",
      position: "bottom",
    });
  };

  const pickImage = async () => {
    const multiple = true;

    addImageFromCameraRoll(
      multiple,
      "project",
      post.projectId,
      progressCallback,
      completedCallback,
    );
  };

  const completedCallback = (sourceDownloadURLarray) => {
    console.log("completedCallback", sourceDownloadURLarray);

    //firstly check if the images are already parsed into an array with each element having a ratio and a URL.  if the ratio is not set, set it to 0.666
    sourceDownloadURLarray.forEach((element) => {
      if (!element.ratio) {
        element.ratio = 0.666;
      }
      return sourceDownloadURLarray;
    });

    setPost({ ...post, images: sourceDownloadURLarray });
    updatePost(post, saveComplete);
    Toast.show({
      type: "success",
      text1: "Complete",
      position: "bottom",
    });
  };

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPressIn={() => {
                save();
              }}
            >
              <Text>{t("done")}</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.title}>
            <Text
              style={[
                styles.label,
                { color: Colors[colorScheme ?? "light"].textDisabledColor },
              ]}
            >
              Title
            </Text>
            <TextInput
              style={[
                styles.titleText,
                { color: Colors[colorScheme ?? "light"].textField },
              ]}
              onChangeText={(title) => setPost({ ...post, caption: title })}
              placeholder={"Note"}
              value={post.caption}
              autoFocus={true}
              multiline={true}
              numberOfLines={10}
            />
          </View>
          <View style={styles.title}>
            <Text
              style={[
                styles.label,
                { color: Colors[colorScheme ?? "light"].textDisabledColor },
              ]}
            >
              External Link
            </Text>
            <TextInput
              style={[
                styles.titleText,
                { color: Colors[colorScheme ?? "light"].textField },
              ]}
              onChangeText={(linkURL) => setPost({ ...post, linkURL: linkURL })}
              placeholder={"URL"}
              value={post.linkURL}
              multiline={true}
              numberOfLines={10}
            />
          </View>

          <ImageGrid imageUrls={post.images} />

          <Pressable
            style={styles.option}
            onPress={() => {
              //onClose();
              pickImage();
            }}
          >
            <Text style={styles.optionText}>Change Photos</Text>
            <MaterialIcons
              name="camera-roll"
              size={24}
              color={Colors[colorScheme ?? "light"].text}
            />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    width: "100%",
  },
  optionText: {
    fontSize: 18,
    textAlign: "right",
    flex: 1,
    marginRight: 10,
  },
  title: {
    marginBottom: 20,
  },
  label: {
    color: "lightgrey",
    marginBottom: 5,
    paddingLeft: 5,
  },
  titleText: {
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
});
