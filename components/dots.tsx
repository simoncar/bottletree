import React from "react";

import { Dimensions, StyleSheet, Pressable } from "react-native";
import { View, Text, ParsedText } from "../components/Themed";

export const Dots = (props) => {
    const numberImages = 1; //props.images[].length

    if (numberImages > 1) {
        return (
            <View style={styles.dotContainer}>
                {props.images.map((image, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                backgroundColor:
                                    index === props.activeIndex
                                        ? "#ffffff"
                                        : "#000000",
                            },
                        ]}
                    />
                ))}
            </View>
        );
    }
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
