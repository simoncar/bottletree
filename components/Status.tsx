import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, useColorScheme, Pressable } from "react-native";
import { View, Text, TextInput, ParsedText } from "./Themed";
import { addComment, getComments } from "../lib/APIpost";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "../constants/Colors";
import { IComment } from "../lib/types";
import { useAuth } from "../lib/authProvider";
import { Timestamp } from "firebase/firestore";

type Props = {
  project: string;
  post: string;
  status: string;
};

const Status = ({ project, post }: Props) => {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.statusOverall}>
      <View style={styles.statusStart}>
        <Text>New</Text>
      </View>
      <View style={styles.status}>
        <Text>In Progress</Text>
      </View>
      <View style={styles.statusEnd}>
        <Text>Done</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  status: {
    borderColor: "lightgray",
    borderRadius: 7,
    borderWidth: 1,
    flexDirection: "row",
    flex: 1,
    padding: 3,
  },
  statusEnd: {
    borderColor: "lightgray",
    borderRadius: 7,
    borderWidth: 1,
    flexDirection: "row",
    marginLeft: 3,
    padding: 3,
  },
  statusOverall: { flexDirection: "row", marginTop: 5 },
  statusStart: {
    borderColor: "green",
    borderRadius: 7,
    borderWidth: 1,
    flexDirection: "row",
    marginRight: 3,
    padding: 3,
  },

});

export default Status;
