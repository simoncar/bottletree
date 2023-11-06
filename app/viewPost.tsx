import React, { useContext, useState } from "react";
import { StyleSheet, Dimensions, View, Text } from "react-native";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { router, useLocalSearchParams, Stack } from "expo-router";

export default function viewPost() {
  const { key, image, caption, ratio } = useLocalSearchParams();

  return (
    <View
      style={{
        flex: 1,
        height: Dimensions.get("window").height - 200,
        backgroundColor: "#010101",
      }}>
      <View>
        <Text>AAA</Text>
      </View>
      {image && (
        <ImageZoom
          uri={image}
          style={{
            height: Dimensions.get("window").height - 200,
            resizeMode: "contain",
            overflow: "hidden",
          }}
          onInteractionStart={() => console.log("Interaction started")}
          onInteractionEnd={() => console.log("Interaction ended")}
          onPinchStart={() => console.log("Pinch gesture started")}
          onPinchEnd={() => console.log("Pinch gesture ended")}
          onPanStart={() => console.log("Pan gesture started")}
          onPanEnd={() => console.log("Pan gesture ended")}
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
