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
import Ionicons from "@expo/vector-icons/Ionicons";

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
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.leftText}>
          {post.author} · {getRelativeTime(post.timestamp?.toDate() ?? 0)}
        </Text>
        <Text style={styles.rightText}>
          <Ionicons name="ellipsis-horizontal" size={20} />
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    paddingTop: 10,
  },
  leftText: {
    color: "grey",
    fontSize: 12,
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
