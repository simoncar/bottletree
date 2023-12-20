import React, { useState } from "react";

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
  const [footer, setFooter] = useState<boolean>(false);

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
        <Pressable onPress={() => setFooter(!footer)}>
          <Text style={styles.rightText}>
            <Ionicons name="ellipsis-horizontal" size={20} />
          </Text>
        </Pressable>
      </View>
      {footer && (
        <View style={styles.boxContainer}>
          <View style={styles.box}>
            <View style={styles.actionRow}>
              <Text style={styles.actionLeftText}>Share</Text>

              <Ionicons
                style={[
                  styles.actionRightIcon,
                  { color: Colors[colorScheme ?? "light"].text },
                ]}
                name="share-outline"
                size={25}
              />
            </View>
            <View style={styles.line} />
            <View style={styles.actionRow}>
              <Text style={styles.actionLeftText}>Edit</Text>

              <Ionicons
                style={[
                  styles.actionRightIcon,
                  { color: Colors[colorScheme ?? "light"].text },
                ]}
                name="ios-pencil"
                size={25}
              />
            </View>
            <View style={styles.line} />

            <View style={styles.actionRow}>
              <Text style={[styles.actionLeftText, { color: "red" }]}>
                Delete
              </Text>
              <Ionicons
                style={[styles.actionRightIcon, { color: "red" }]}
                name="md-trash-outline"
                size={25}
              />
            </View>
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
