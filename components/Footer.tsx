import React, { useState } from "react";
import { router } from "expo-router";
import { StyleSheet, Pressable, useColorScheme } from "react-native";
import { View, Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { IPost } from "@/lib/types";
import { getRelativeTime } from "@/lib/util";

import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { deletePost } from "@/lib/APIpost";
import alert from "@/lib/alert";
import { useTranslation } from "react-i18next";

type Props = {
  project: string;
  post: IPost;
  commentShow: boolean;
  setCommentShow: (commentShow: boolean) => void;
};

const Footer = ({ post, setCommentShow }: Props) => {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const [footer, setFooter] = useState<boolean>(false);

  const saveDone = () => {
    console.log("saveDone footer: delete ");
  };

  const askComment = () => {
    setFooter(!footer);
    setCommentShow(true);
  };

  const openEdit = () => {
    router.navigate({
      pathname: "/editPost",
      params: {
        projectId: post.projectId,
        postId: post.key,
      },
    });
  };

  const askDelete = () => {
    setFooter(!footer);

    alert(
      t("delete"),
      t("areYouSure"),
      [
        {
          text: t("cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("delete"),
          onPress: () => {
            deletePost(post, saveDone);
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.leftText}>
          {post.author} ·{" "}
          {getRelativeTime(post.timestamp?.toDate()?.getTime() ?? 0)}
        </Text>
        <Pressable onPress={() => setFooter(!footer)}>
          <Text style={styles.rightText}>
            <Ionicons name="ellipsis-horizontal" size={20} />
          </Text>
        </Pressable>
      </View>
      {footer && (
        <View style={styles.boxContainer}>
          <View style={styles.box}>
            <Pressable
              onPress={() => {
                setFooter(!footer);
                openEdit();
              }}
            >
              <View style={styles.actionRow}>
                <Text style={styles.actionLeftText}>{t("edit")}</Text>

                <Ionicons
                  style={[
                    styles.actionRightIcon,
                    { color: Colors[colorScheme ?? "light"].text },
                  ]}
                  name="pencil"
                  size={25}
                />
              </View>
            </Pressable>
            <View style={styles.line} />
            <Pressable
              onPress={() => {
                askComment();
              }}
            >
              <View style={styles.actionRow}>
                <Text style={styles.actionLeftText}>{t("comment")}</Text>
                <MaterialIcons
                  name="send"
                  style={[
                    styles.actionRightIcon,
                    { color: Colors[colorScheme ?? "light"].text },
                  ]}
                  size={25}
                />
              </View>
            </Pressable>
            <View style={styles.line} />
            <Pressable
              onPress={() => {
                askDelete();
              }}
            >
              <View style={styles.actionRow}>
                <Text style={[styles.actionLeftText, { color: "red" }]}>
                  {t("delete")}
                </Text>
                <Ionicons
                  style={[styles.actionRightIcon, { color: "red" }]}
                  name="trash-outline"
                  size={25}
                />
              </View>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actionLeftText: {
    fontSize: 18,
  },
  actionRightIcon: {
    textAlign: "right",
  },
  actionRow: {
    alignItems: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
    height: 40,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 5,
    width: "100%",
  },
  box: {
    backgroundColor: "transparent",
    borderColor: "grey",
    borderRadius: 10,
    borderWidth: 1,
    width: "66%",
  },
  boxContainer: {
    alignItems: "center",
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  container: {
    backgroundColor: "transparent",
    paddingTop: 10,
  },
  leftText: {
    color: "grey",
    fontSize: 12,
  },
  line: {
    backgroundColor: "grey",
    height: 1,
    width: "100%",
  },
  rightText: {
    color: "grey",
    fontSize: 16,
    textAlign: "right",
  },
  row: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    width: "100%",
  },
});

export default Footer;
