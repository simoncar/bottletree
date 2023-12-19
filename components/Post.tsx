import React from "react";
import {
  Dimensions,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import { router } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import { View, Text, ParsedText } from "../components/Themed";
import Comments from "./PostComments";
import Status from "./Status";
import Dots from "../components/dots";
import Colors from "../constants/Colors";

const Post = (props) => {
  const colorScheme = useColorScheme();
  const { post } = props;

  const imageUrls = post.images && post.images.map((image) => image);

  let caption = "";
  let ratio = 0.66666;
  let width = Dimensions.get("window").width - 50;

  if (typeof post.ratio === "number") {
    ratio = Number(post.ratio);
    if (ratio > 1) {
      width = Dimensions.get("window").width * 0.68;
    }
  }

  if (post.caption != undefined) {
    caption = post.caption;
  }

  return (
    <View>
      <View
        style={[
          styles.postView,
          {
            backgroundColor: Colors[colorScheme ?? "light"].postBackground,
            borderColor: Colors[colorScheme ?? "light"].postBackground,
          },
        ]}>
        {renderImage()}
        <Dots images={imageUrls} />
        <Status project={post.projectId} post={post.key} status={post.status} />
        <View
          style={[
            styles.commentBlock,
            { backgroundColor: Colors[colorScheme ?? "light"].postBackground },
          ]}>
          <Text style={styles.comment}>{caption}</Text>
          <Comments project={post.projectId} post={post.key} />
        </View>
      </View>
    </View>
  );

  function renderImage() {
    if (imageUrls.length == 1) {
      return (
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/viewPost",
              params: {
                project: post.projectId,
                key: post.key,
                image: encodeURIComponent(imageUrls),
                caption: caption || "",
                ratio: ratio,
              },
            });
          }}>
          <View style={styles.imageContainer}>
            <Image
              style={[
                styles.storyPhoto,
                { width: width, height: width * ratio },
              ]}
              source={imageUrls[0]}
            />
          </View>
        </Pressable>
      );
    } else if (imageUrls.length > 1) {
      return (
        <View style={styles.imageContainer}>
          <Carousel
            width={width}
            panGestureHandlerProps={{
              activeOffsetX: [-10, 10],
            }}
            height={width * ratio}
            data={imageUrls}
            renderItem={({ index }) => (
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/viewPost",
                    params: {
                      project: post.projectId,
                      key: post.key,
                      image: encodeURIComponent(imageUrls[index]),
                      caption: caption,
                      ratio: ratio,
                    },
                  });
                }}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    justifyContent: "center",
                  },
                ]}>
                <View style={styles.imageContainer}>
                  <Image
                    style={[
                      styles.storyPhoto,
                      { width: width, height: width * ratio },
                    ]}
                    source={imageUrls[index]}
                  />
                </View>
              </Pressable>
            )}
          />
        </View>
      );
    }
  }
};

const styles = StyleSheet.create({
  comment: {
    fontSize: 20,
    padding: 8,
    paddingVertical: 12,
  },
  commentBlock: {
    borderRadius: 10,
    padding: 8,
  },

  imageContainer: {
    backgroundColor: "transparent",
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  listItemHeader: {
    alignItems: "center",
    flexDirection: "row",
    padding: 8,
  },
  postView: {
    borderRadius: 10,
    borderWidth: 10,
    flex: 1,
    marginBottom: 5,
    marginHorizontal: 5,
    marginTop: 5,
    paddingVertical: 8,
  },
  storyPhoto: {
    alignSelf: "center",
    borderColor: "lightgray",
    borderRadius: 5,
    height: 300,
    marginBottom: 12,
    marginTop: 12,
    padding: 8,
  },
});

export default Post;
