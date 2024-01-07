import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Pressable,
  useColorScheme,
  View,
} from "react-native";
import { router } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import { Text, ParsedText } from "../components/Themed";
import Comments from "./PostComments";
import Dots from "../components/dots";
import Footer from "../components/Footer";
import Colors from "../constants/Colors";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";

const Post = (props) => {
  const colorScheme = useColorScheme();
  const [commentShow, setCommentShow] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
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

  function renderImage() {
    return (
      <View style={{}}>
        {imageUrls.map((im, index) => {
          return (
            <View style={{ borderRadius: 10, borderWidth: 10 }} key={index}>
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/viewPost",
                    params: {
                      project: post.projectId,
                      key: post.key,
                      image: encodeURIComponent(im),
                      caption: caption || "",
                      ratio: ratio,
                    },
                  });
                }}>
                <Image
                  style={{
                    width: Dimensions.get("window").width - 50,
                    height: Dimensions.get("window").width - 50 * ratio,
                  }}
                  source={im}
                  contentFit="contain"
                />
              </Pressable>
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.postView,
        {
          backgroundColor: Colors[colorScheme ?? "light"].postBackground,
          borderColor: Colors[colorScheme ?? "light"].postBackground,
        },
      ]}>
      {renderImage()}
      {!(<Dots images={imageUrls} activeImage={activeImage} />)}

      <View style={styles.commentView}>
        <Text style={styles.comment}>{caption}</Text>
        <Comments
          project={post.projectId}
          post={post.key}
          commentShow={commentShow}
          setCommentShow={setCommentShow}
        />
      </View>

      <Footer
        project={post.projectId}
        post={post}
        commentShow={commentShow}
        setCommentShow={setCommentShow}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  comment: {
    fontSize: 20,
    paddingBottom: 12,
    paddingLeft: 10,
  },
  commentView: {
    backgroundColor: "transparent",
  },

  postView: {
    borderRadius: 10,
    borderWidth: 10,
    flex: 1,
    marginBottom: 5,
    marginHorizontal: 5,
    marginTop: 5,
  },
});

export default Post;
