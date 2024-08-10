import React from "react";
import { Image } from "expo-image";
import { StyleSheet, useColorScheme } from "react-native";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "@/components/Themed";

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
  user: any;
};

export const UserAvatar = ({ uid, photoURL, user }: Props) => {
  console.log("UserAvatar: ", uid, photoURL, user);

  if (user?.email == undefined) {
    return (
      <View style={styles.container}>
        <View style={styles.button}>
          <Link
            href={{
              pathname: "/signIn",
            }}>
            <Text style={styles.loginText}>Sign in</Text>
          </Link>
        </View>
      </View>
    );
  } else {
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
  }
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    marginRight: 12,
    textAlign: "center",
    width: 50,
  },
  avatarFace: { borderRadius: 35 / 2, height: 35, width: 35 },
  button: {
    alignItems: "center",
    backgroundColor: "#9D5BD0",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    marginBottom: 10,
    width: 150,
  },
  container: {
    alignItems: "center",
    flex: 1,
    paddingRight: 10,
    paddingTop: 10,
  },
  loginText: {
    color: "white",
    fontSize: 18,
  },
});
