import React from "react";

import { StyleSheet, useColorScheme } from "react-native";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";

type Props = {
  images: [];
  activeImage: number;
};

const Dots = ({ images, activeImage }: Props) => {
  const imageArray = images;
  const colorScheme = useColorScheme();

  return (
    <View style={styles.dotContainer}>
      {imageArray.length > 1 &&
        images.map((image, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === activeImage
                    ? Colors[colorScheme ?? "light"].dotsActive
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
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
});

export default Dots;
