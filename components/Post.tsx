import React from "react";
import { Dimensions, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import { View, Text, ParsedText } from "../components/Themed";
import { blurhash } from "../constants/Colors";
import Comments from "./PostComments";
import Status from "./Status";
import Dots from "../components/dots";

const Post = (props) => {
  const { post } = props;

  const imageUrls = post.images && post.images.map((image) => image);

  let caption = "";
  let ratio = 0.66666;
  let width = Dimensions.get("window").width;

  if (typeof post.ratio === "number") {
    ratio = Number(post.ratio);
    if (ratio > 1) {
      width = Dimensions.get("window").width * 0.68;
    }
  }

  if (post.caption != undefined) {
    caption = post.caption;
  }

  console.log("post: ", post.timestamp.toDate());

  return (
    <View>
      <View style={styles.listItemHeader}></View>

      <View style={styles.postView}>
        {renderImage()}
        <Dots images={imageUrls} />
        <Status project={post.projectId} post={post.key} status={post.status} />
        <View style={styles.commentBlock}>
          <ParsedText style={styles.comment} text={caption} />
          <Text style={styles.commentTime}>
            {new Date(post.timestamp.toDate()).toDateString()}
          </Text>
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
              pathname: "/editPost",
              params: {
                project: post.projectId,
                key: post.key,
                image: imageUrls,
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
    } else {
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
                    pathname: "/editPost",
                    params: {
                      project: post.projectId,
                      key: post.key,
                      image: imageUrls[index],
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
    fontSize: 16,
  },
  commentBlock: {
    padding: 8,
  },
  commentTime: {
    color: "#999",
    fontSize: 12,
    paddingTop: 4,
  },

  imageContainer: {
    borderWidth: 0,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  listItemHeader: {
    alignItems: "center",
    flexDirection: "row",
    padding: 8,
  },

  postView: { flex: 1 },
  storyPhoto: {
    alignSelf: "center",
    borderColor: "lightgray",
    height: 300,
    marginBottom: 12,
    marginTop: 12,
    padding: 8,
  },
});

export default Post;
