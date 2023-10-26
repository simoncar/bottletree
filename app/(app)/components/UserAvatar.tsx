import React from "react";
import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { router } from "expo-router";
import { View } from "./Themed";
import Colors from "../../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

function renderPhotoURL(photoURL) {
  const colorScheme = useColorScheme();
  if (photoURL == "") {
    return (
      <View>
        <Ionicons
          name="ios-person-circle-outline"
          size={40}
          color={Colors[colorScheme ?? "light"].text}
        />
      </View>
    );
  } else {
    return (
      <View>
        <Image style={styles.avatarFace} source={photoURL}></Image>
      </View>
    );
  }
}

type Props = {
  uid: string;
  photoURL: string;
  displayName: string;
};

export const UserAvatar = ({ uid, photoURL, displayName }: Props) => {
  return (
    <TouchableOpacity
      key={"editProfile"}
      onPress={() => {
        router.push({
          pathname: "/user",
          params: {
            uid: uid,
            photoURL: photoURL,
            displayName: displayName,
          },
        });
      }}>
      <View style={styles.avatar}>{renderPhotoURL(photoURL)}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    marginRight: 12,
    textAlign: "center",
    width: 50,
  },
  avatarFace: { borderRadius: 35 / 2, height: 35, width: 35 },
});
