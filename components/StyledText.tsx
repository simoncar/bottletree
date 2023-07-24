import React from "react";
import { Text, TextProps } from "./Themed";
import { StyleSheet } from "react-native";

export function MonoText(props: TextProps) {
    return (
        <Text selectable {...props} style={[props.style, styles.monotext]} />
    );
}

export function BigText(props: TextProps) {
    return <Text selectable {...props} style={[props.style, styles.bigtext]} />;
}

const styles = StyleSheet.create({
    bigtext: { fontFamily: "FuturaBold" },
    monotext: { fontFamily: "SpaceMono" },
});
