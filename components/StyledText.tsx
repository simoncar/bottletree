import React from "react";
import { Text, TextProps } from "./Themed";

export function MonoText(props: TextProps) {
    return (
        <Text
            selectable
            {...props}
            style={[props.style, { fontFamily: "SpaceMono" }]}
        />
    );
}

export function BigText(props: TextProps) {
    return (
        <Text
            selectable
            {...props}
            style={[props.style, { fontFamily: "FuturaBold" }]}
        />
    );
}
