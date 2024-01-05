import React from "react";
import { View, Text, Dimensions } from "react-native";
import { FlashList } from "@shopify/flash-list";

const DATA = [
  {
    title: "First Item",
  },
  {
    title: "Second Item",
  },
  {
    title: "Third Item",
  },
  {
    title: "Fourth Item",
  },
  {
    title: "Fifth Item",
  },
];

const Masonry = (props) => {
  return (
    <View style={{ height: 200, width: Dimensions.get("screen").width }}>
      <FlashList
        data={DATA}
        renderItem={({ item }) => <Text>{item.title}</Text>}
        estimatedItemSize={200}
      />
    </View>
  );
};

export default Masonry;
