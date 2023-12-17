import React, { useContext, useState } from "react";
import { StyleSheet, Dimensions, View, Text } from "react-native";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { router, useLocalSearchParams, Stack } from "expo-router";

export default function viewPost() {
  const { key, image, caption, ratio } = useLocalSearchParams();

  console.log("viewPost: ", key, image, caption, ratio);

  return (
    <View style={styles.overall}>
      <View>
        <Text>AAA</Text>
      </View>
      {image && (
        <ImageZoom
          uri={image}
          style={styles.imageZoom}
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
  imageZoom: {
    height: Dimensions.get("window").height - 200,
    overflow: "hidden",
    resizeMode: "contain",
  },
  overall: {
    backgroundColor: "#010101",
    flex: 1,
    height: Dimensions.get("window").height - 200,
  },
});
