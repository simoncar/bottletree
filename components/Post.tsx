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

const { width } = Dimensions.get("window");

const Post = (props) => {
  const { post } = props;

  const imageUrls = post.images && post.images.map((image) => image);

  let caption = "";
  let ratio = 0.66666;
  if (typeof post.ratio === "number") {
    ratio = Number(post.ratio);
  }

  if (post.caption != undefined) {
    caption = post.caption;
  }

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
              style={[styles.image, { height: width * ratio }]}
              source={{
                uri: imageUrls[0],
              }}
              placeholder={blurhash}
            />
          </View>
        </Pressable>
      );
    } else {
      return (
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
                  style={[styles.image, { height: width * ratio }]}
                  source={{
                    uri: imageUrls[index],
                  }}
                  placeholder={blurhash}
                  contentFit="contain"
                />
              </View>
            </Pressable>
          )}
        />
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
  image: {
    backgroundColor: "#0553",
    flex: 1,
    width: "100%",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
  },
  postView: { flex: 1 },

  listItemHeader: {
    alignItems: "center",
    flexDirection: "row",
    padding: 8,
  },
});

export default Post;
