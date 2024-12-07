import React from "react";
import { StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Text, View } from "@/components/Themed";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = {
  uid: string;
  photoURL: string;
  user: any;
};

const renderPhotoURL = (photoURL: string) => {
  if (!photoURL) {
    return <Ionicons name="person-circle-outline" size={40} color="#999999" />;
  }
  return <Image style={styles.avatarFace} source={photoURL} />;
};

export const UserAvatar = ({ uid, photoURL, user }: Props) => {
  if (!user?.email) {
    return (
      <Link href="/signIn" style={styles.container}>
        <View style={styles.button}>
          <Text style={styles.loginText}>Sign in</Text>
        </View>
      </Link>
    );
  }

  return (
    <Link
      href={{
        pathname: "/user/[uid]",
        params: { uid },
      }}
      style={styles.container}>
      <View style={styles.avatar}>{renderPhotoURL(photoURL)}</View>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    padding: 10,
  },
  loginText: {
    fontSize: 16,
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  avatarFace: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
