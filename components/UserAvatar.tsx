import React from "react";
import { Image } from "expo-image";
import { StyleSheet, Pressable, useColorScheme, View } from "react-native";
import { router, Link } from "expo-router";
import Colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

function renderPhotoURL(photoURL) {
  const colorScheme = useColorScheme();
  if (!photoURL) {
    return (
      <View>
        <Ionicons
          name="person-circle-outline"
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
};

export const UserAvatar = ({ uid, photoURL }: Props) => {
  return (
    <View>
      <Link
        href={{
          pathname: "/user/[uid]",
          params: { uid: uid },
        }}>
        <View style={styles.avatar}>{renderPhotoURL(photoURL)}</View>
      </Link>
    </View>
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
