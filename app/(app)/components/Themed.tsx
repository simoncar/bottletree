/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  TextInput as DefaultTextInput,
  Text as DefaultText,
  useColorScheme,
  View as DefaultView,
  Button as DefaultButton,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import Colors from "../../../constants/Colors";
import React from "react";
import { ParsedTextUnthemed } from "./ParsedText";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type ButtonProps = ThemeProps & DefaultButton["props"];
export type ParsedTextProps = ThemeProps & ParsedTextUnthemed["props"];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const colorPlaceholder = useThemeColor(
    { light: lightColor, dark: darkColor },
    "textPlaceholder",
  );

  return (
    <DefaultTextInput
      style={[{ color }, style]}
      placeholderTextColor={colorPlaceholder}
      {...otherProps}
    />
  );
}

export function Button(props: ButtonProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <View style={styles.button}>
      <TouchableOpacity
        style={[{ color }, style, { borderWidth: 0, elevation: 0 }]}
        {...otherProps}
      />
      <Text style={styles.loginText}>{props.text}</Text>
    </View>
  );
}

export function ParsedText(props: ParsedTextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <ParsedTextUnthemed textColor={color} linkColor={color} {...otherProps} />
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2196F3",
    borderColor: "lightgray",
    borderRadius: 100,

    padding: 10,
  },
  loginText: {
    color: "white",
  },
});
