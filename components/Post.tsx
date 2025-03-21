import Footer from "@/components/Footer";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import Comments from "./PostComments";

const Post = (props) => {
  const colorScheme = useColorScheme();
  const [commentShow, setCommentShow] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const { post } = props;

  const imageUrls = post.images && post.images.map((image) => image);
  const caption = post.caption !== undefined ? post.caption : "";

  function renderImage() {
    if (imageUrls.length == 0) {
      return;
    }
    return (
      <View style={{ paddingVertical: 5 }}>
        {imageUrls.map((im, index) => {
          const ratio = Number(im.ratio);
          const width = Dimensions.get("window").width - 60;

          return (
            <View style={{ paddingVertical: 5 }} key={index}>
              <Pressable
                key={"aa" + index}
                onPress={() => {
                  router.navigate({
                    pathname: "/viewPost",
                    params: {
                      image: encodeURIComponent(im.url),
                      width: width,
                      height: width * ratio,
                    },
                  });
                }}>
                <Image
                  style={{
                    width: "100%",
                    height: width * ratio,
                  }}
                  source={im.url}
                  contentFit="contain"
                />
              </Pressable>
            </View>
          );
        })}
      </View>
    );
  }

  function renderFile(post) {
    return (
      <Pressable
        onPress={() => {
          router.navigate({
            pathname: "/files",
            params: { file: post.file },
          });
        }}>
        <Text style={styles.comment}>{post.caption}</Text>
      </Pressable>
    );
  }

  function renderCaption(caption) {
    return <Text style={styles.comment}>{caption}</Text>;
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

      <View style={styles.commentView}>
        {post.file ? renderFile(post) : renderCaption(caption)}

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
  caption: { fontSize: 20 },

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
