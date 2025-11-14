import Colors from "@/constants/Colors";
import { addComment, getComments } from "@/lib/APIpost";
import { serverTimestamp } from "@/lib/firebase";
import { IComment } from "@/lib/types";
import { UserContext } from "@/lib/UserContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, StyleSheet, useColorScheme } from "react-native";
import { ParsedText, TextInput, View } from "./Themed";

type Props = {
  project: string;
  post: string;
  commentShow: boolean;
  setCommentShow: (commentShow: boolean) => void;
};

const Comments = ({ project, post, commentShow, setCommentShow }: Props) => {
  const { t } = useTranslation();
  const defaultComment = t("addAComment");
  const [comments, setComments] = useState([]);
  const [text, setComment] = useState("");
  const { user } = useContext(UserContext);
  const [saved, setSaved] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    getComments(project, post).then((comments) => {
      setComments(comments);
    });
  }, [project, post]);

  useEffect(() => {
    getComments(project, post).then((comments) => {
      setComments(comments);
      setSaved(false);
    });
  }, [project, post, saved]);

  useEffect(() => {
    if (commentShow === true) {
      setComment(null);
    }
  }, [commentShow]);

  const saveDone = (comment: IComment | string) => {
    setSaved(true);
    setComment("");
  };

  const save = () => {
    setCommentShow(false);
    const comment: IComment = {
      comment: text,
      displayName: user.displayName,
      timestamp: serverTimestamp(),
      uid: user.uid,
    };

    addComment(project, post, comment, saveDone);
  };

  const displayName = (displayName: string) => {
    const replacedString = displayName.replace(/ /g, " #");
    return "#" + replacedString + " ";
  };

  const renderInput = () => {
    return (
      <View style={styles.inputBubble}>
        <TextInput
          style={styles.commentInput}
          placeholder={defaultComment}
          onFocus={() => {
            // setCommentShow(true);
            console.log("onFocus renderInput PostComment");
          }}
          onChangeText={(text) => {
            setComment(text);
            setCommentShow(true);
          }}
          value={text}
          //autoFocus
          multiline
        />
        <Pressable
          style={styles.inputAction}
          hitSlop={10}
          onPress={() => {
            save();
          }}
        >
          <MaterialIcons name="send" size={25} color="#f97316" />
        </Pressable>
      </View>
    );
  };

  const renderBubble = (item: IComment) => {
    let bubbleBackgroundColor =
      Colors[colorScheme ?? "light"].bubbleBackgroundColorOther;
    let bubbbleTextColor = Colors[colorScheme ?? "light"].bubbleTextColorOther;
    if (item.displayName === user.displayName) {
      bubbleBackgroundColor =
        Colors[colorScheme ?? "light"].bubbleBackgroundColorMe;
      bubbbleTextColor = Colors[colorScheme ?? "light"].bubbleTextColorMe;
    }

    return (
      <View
        style={[
          styles.commentBubble,
          { backgroundColor: bubbleBackgroundColor },
        ]}
      >
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
      {renderInput()}
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
