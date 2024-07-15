import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Pressable,
  useColorScheme,
  View,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Text, ParsedText } from "@/components/Themed";
import Comments from "./PostComments";
import Dots from "@/components/dots";
import Footer from "@/components/Footer";
import Colors from "@/constants/Colors";

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
                onPress={() => {
                  router.navigate({
                    pathname: "/viewPost",
                    params: {
                      project: post.projectId,
                      key: post.key,
                      image: encodeURIComponent(im.url),
                      caption: caption || "",
                      ratio: ratio,
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

  function renderAddProject() {
    if (post.projectId == "welcome") {
      return (
        <View style={styles.container}>
          <TouchableOpacity
            key={"createProject"}
            style={styles.createBtn}
            onPress={async () => {
              router.replace({
                pathname: "project/add",
              });
            }}>
            <Text style={styles.createText}>+ Create Project</Text>
          </TouchableOpacity>
        </View>
      );
    }
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
      {renderAddProject()}
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
  container: {
    alignItems: "center",
    flex: 1,
    paddingTop: 40,
  },
  createBtn: {
    alignItems: "center",
    backgroundColor: "#9D5BD0",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    marginBottom: 40,
    width: "80%",
  },
  createText: {
    color: "white",
    fontSize: 18,
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
