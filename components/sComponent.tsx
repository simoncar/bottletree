import React from "react";
import {
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
  View,
} from "react-native";

export function Text(props) {
  const { style, ...rest } = props;

  return (
    <RNText {...rest} style={[styles.defaultStyle, style]}>
      {rest.children}
    </RNText>
  );
}

export function Button(props) {
  const { style, ...rest } = props;

  return (
    <View style={styles.buttonView}>
      <TouchableOpacity
        style={[styles.submitButtonStyle, style]}
        activeOpacity={0.5}
        onPress={rest.onPress}>
        <Text style={[styles.defaultStyle, style]}>{rest.title}</Text>
      </TouchableOpacity>
    </View>
  );
}

export function ShortList(props) {
  const { navigation } = props; //keep this?  can't remember why

  const features = props.data ? props.data : [];
  return (
    <View>
      {features.map((el) => {
        return props.renderItem(el);
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonView: {
    alignItems: "center",
    flexDirection: "column",
    marginTop: 12,
  },
  defaultStyle: {
    fontFamily: "SegoeUI",
    fontSize: 17,
  },
  submitButtonStyle: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    elevation: 4,
    height: 50,

    justifyContent: "center",
    marginBottom: 30,
    shadowColor: "rgba(0,0,0, .4)",
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    width: 250,
  },
});
