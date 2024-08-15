import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { useSession } from "@/lib/ctx";
import { auth } from "@/lib/firebase";
import { UserContext } from "@/lib/UserContext";
import { Link } from "expo-router";
import * as Application from "expo-application";

export const About = () => {
  const { user } = useContext(UserContext);
  const { session } = useSession();

  if (null == user) {
    return <View />;
  } else {
    return (
      <View style={styles.aboutContainer}>
        <Link
          href={{
            pathname: "/user/[uid]",
            params: { uid: session },
          }}>
          <Text style={styles.version}>Name: {user.displayName}</Text>
        </Link>
        <Text style={styles.version}>Email: {user.email}</Text>
        <Text style={styles.version}>
          Anonymous: {auth().currentUser?.isAnonymous}
        </Text>
        <Text style={styles.version}>
          {Application.nativeApplicationVersion} (
          {Application.nativeBuildVersion}) | 2
        </Text>
        <Text style={styles.version}>User Context - {user.uid}</Text>
        <Text style={styles.version}>CTX - {session}</Text>
        <Text style={styles.version}>Auth - {auth().currentUser?.uid}</Text>
        <Text style={styles.version}>Project - {user.project}</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  aboutContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 490,
  },
  version: {
    color: "grey",
    fontSize: 10,
  },
});
