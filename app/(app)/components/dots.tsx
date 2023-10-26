import React from "react";

import {
  Dimensions,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import { View, Text, ParsedText } from "./Themed";
import Colors from "../../../constants/Colors";

const Dots = (props) => {
  const numberImages = 1; //props.images[].length
  const imageArray = props.images;
  const colorScheme = useColorScheme();

  return (
    <View style={styles.dotContainer}>
      {imageArray.length > 1 &&
        props.images.map((image, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === props.activeIndex
                    ? "yellow"
                    : Colors[colorScheme ?? "light"].dots,
              },
            ]}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    borderRadius: 5,
    height: 5,
    marginHorizontal: 2,
    width: 5,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
});

export default Dots;
