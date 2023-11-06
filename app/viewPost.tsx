import React, { useContext, useState } from "react";
import { StyleSheet, useColorScheme, Dimensions, View } from "react-native";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { router, useLocalSearchParams, Stack } from "expo-router";
import ProjectContext from "../lib/projectContext";

export default function viewPost() {
  const { key, image, caption, ratio } = useLocalSearchParams();

  return (
    <View
      style={{
        flex: 1,
        height: Dimensions.get("window").height,
        backgroundColor: "#010101",
      }}>
      {image && (
        <ImageZoom
          uri={image}
          style={{
            flex: 1,
            width: "100%",
            height: Dimensions.get("window").height,
            resizeMode: "contain",
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  descriptionView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 8,
    padding: 8,
  },
  input: {
    fontSize: 20,
    margin: 12,
    padding: 10,
    paddingLeft: 20,
    width: "98%",
  },
  leftContent: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 8,
  },
  outerView: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    paddingVertical: 8,
    padding: 8,
  },
  rightChevron: {
    marginHorizontal: 8,
  },

  storyPhoto: {
    alignSelf: "center",
    borderColor: "lightgray",
    marginBottom: 12,
    marginTop: 12,
    width: "98%",
  },
});
