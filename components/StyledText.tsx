import React from "react";
import { Text, TextProps } from "./Themed";

export function MonoText(props: TextProps) {
	return <Text {...props} style={[props.style, { fontFamily: "SpaceMono" }]} />;
}

export function BigText(props: TextProps) {
	return <Text {...props} style={[props.style, { fontFamily: "FuturaBold" }]} />;
}

