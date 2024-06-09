import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, useColorScheme, Pressable } from "react-native";
import { View, Text, TextInput, ParsedText } from "./Themed";
import { addComment, getComments } from "@/lib/APIpost";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "@/constants/Colors";
import { IComment, IPost } from "@/lib/types";
import { useAuth } from "@/lib/authProvider";
import { firestore } from "@/lib/firebase";

type Props = {
  project: string;
  post: IPost;
  commentShow: boolean;
  setCommentShow: (commentShow: boolean) => void;
};

const Comments = ({ project, post, commentShow, setCommentShow }: Props) => {
  const defaultComment = "Add a comment...";
  const [comments, setComments] = useState([]);
  const [text, setComment] = useState(defaultComment);

  const [saved, setSaved] = useState(false);
  const colorScheme = useColorScheme();
  const { sharedDataUser } = useAuth();

  useEffect(() => {
    getComments(project, post).then((comments) => {
      setComments(comments);
    });
  }, []);

  useEffect(() => {
    getComments(project, post).then((comments) => {
      setComments(comments);
      setSaved(false);
    });
  }, [saved]);

  const saveDone = (comment: IComment) => {
    //setProjects(projectsDB);
    setSaved(true);
    setComment(defaultComment);
  };

  const save = () => {
    setCommentShow(false);
    const comment: IComment = {
      comment: text,
      displayName: sharedDataUser.displayName,
      timestamp: firestore.Timestamp.now(),
      uid: sharedDataUser.uid,
    };

    addComment(project, post, comment, saveDone);
  };

  const showCommentInputBlock = () => {
    setCommentShow(true);
  };

  const displayName = (displayName: string) => {
    if (project == "welcome") {
      return "";
    }
    const replacedString = displayName.replace(/ /g, " #");
    return "#" + replacedString + " ";
  };

  const renderInput = () => {
    if (commentShow) {
      return (
        <View style={styles.inputBubble}>
          <TextInput
            style={styles.commentInput}
            placeholder={defaultComment}
            onChangeText={(text) => {
              setComment(text);
              setCommentShow(true);
            }}
            value={text}
            autoFocus
            multiline
          />
          <Pressable
            style={styles.inputAction}
            hitSlop={10}
            onPress={() => {
              save();
            }}>
            <MaterialIcons name="send" size={25} color="#2196F3" />
          </Pressable>
        </View>
      );
    } else {
      return (
        <View style={styles.inputBubble}>
          <Text
            style={styles.commentInputPlaceholder}
            onPress={() => {
              setCommentShow(true);
              setComment(null);
            }}>
            {text}
          </Text>
          <View style={styles.inputAction}></View>
        </View>
      );
    }
  };

  const renderBubble = (item: IComment) => {
    let bubbleBackgroundColor =
      Colors[colorScheme ?? "light"].bubbleBackgroundColorOther;
    let bubbbleTextColor = Colors[colorScheme ?? "light"].bubbleTextColorOther;
    if (item.displayName == sharedDataUser.displayName) {
      bubbleBackgroundColor =
        Colors[colorScheme ?? "light"].bubbleBackgroundColorMe;
      bubbbleTextColor = Colors[colorScheme ?? "light"].bubbleTextColorMe;
    }

    return (
      <View
        style={[
          styles.commentBubble,
          { backgroundColor: bubbleBackgroundColor },
        ]}>
        <ParsedText
          selectable
          lightColor={bubbbleTextColor}
          darkColor={bubbbleTextColor}
          style={styles.commentText}
          text={displayName(item.displayName) + item.comment}
        />
      </View>
    );
  };

  return (
    <View style={styles.commentsOverall}>
      <FlatList data={comments} renderItem={({ item }) => renderBubble(item)} />

      {project != "welcome" && renderInput()}
    </View>
  );
};

const styles = StyleSheet.create({
  commentBubble: {
    borderRadius: 10,
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,
  },
  commentInput: {
    flex: 1,
    paddingBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  commentInputPlaceholder: {
    color: "lightgray",
    flex: 1,
    paddingBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  commentText: {},

  commentsOverall: { backgroundColor: "transparent" },
  inputAction: {
    backgroundColor: "transparent",
    paddingRight: 10,
    paddingTop: 5,
  },
  inputBubble: {
    borderColor: "lightgray",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
  },
});

export default Comments;
