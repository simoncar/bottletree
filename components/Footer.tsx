import React from "react";

import {
  Dimensions,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import { View, Text, ParsedText } from "../components/Themed";
import Colors from "../constants/Colors";
import { IPost } from "../lib/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

type Props = {
  project: string;
  post: IPost;
};

const Footer = ({ project, post }: Props) => {
  const colorScheme = useColorScheme();

  // create a functiont that accepts a timestamp and returns a string of the relative time from now
  const getRelativeTime = (timestamp: number) => {
    if (timestamp) {
      dayjs.extend(relativeTime);
      return dayjs(timestamp).fromNow();
    } else {
      return "";
    }
  };

  return (
    <View style={styles.footnoteView}>
      <Text style={styles.footnote}>
        {post.author} · {getRelativeTime(post.timestamp?.toDate() ?? 0)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footnote: {
    color: "grey",
  },
  footnoteView: {
    backgroundColor: "transparent",
    paddingLeft: 10,
    paddingTop: 10,
  },
});

export default Footer;
