import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { Image } from "expo-image";

export default function viewPost() {
  const { image } = useLocalSearchParams();

  return (
    <View style={styles.overall}>
      {image && (
        <ReactNativeZoomableView
          maxZoom={null}
          // Give these to the zoomable view so it can apply the boundaries around the actual content.
          // Need to make sure the content is actually centered and the width and height are
          // dimensions when it's rendered naturally. Not the intrinsic size.
          // For example, an image with an intrinsic size of 400x200 will be rendered as 300x150 in this case.
          // Therefore, we'll feed the zoomable view the 300x150 size.
          contentWidth={300}
          contentHeight={150}>
          <Image style={styles.imageZoom} source={image} />
        </ReactNativeZoomableView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageZoom: {
    height: Dimensions.get("window").height - 200,
    overflow: "hidden",
    resizeMode: "contain",
    width: Dimensions.get("window").width,
  },
  overall: {
    backgroundColor: "#010101",
    flex: 1,
    height: Dimensions.get("window").height - 200,
  },
});
