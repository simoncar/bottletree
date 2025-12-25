import React from "react";
import {
  Text as RNText,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

function Text(props) {
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
    <View key={rest.key} style={styles.buttonView}>
      <TouchableOpacity
        style={[styles.submitButtonStyle, style]}
        activeOpacity={0.5}
        onPress={rest.onPress}
      >
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
      {features.map((el, index) => {
        return props.renderItem(el, index);
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
    width: 250,
  },
});
