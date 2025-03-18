import { Text, View } from "@/components/Themed";
import { useSession } from "@/lib/ctx";
import { auth } from "@/lib/firebase";
import { UserContext } from "@/lib/UserContext";
import * as Application from "expo-application";
import { Link } from "expo-router";
import React, { useContext } from "react";
import { StyleSheet } from "react-native";

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
          {Application.nativeBuildVersion}) | 222.app
        </Text>
        <Text style={styles.version}>User Context - {user.uid}</Text>
        <Text style={styles.version}>CTX - {session}</Text>
        <Text style={styles.version}>Auth - {auth().currentUser?.uid}</Text>
        <Text style={styles.version}>Project - {user.project}</Text>
        <Text style={styles.version}>Push - {user.pushToken}</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  version: {
    color: "grey",
    fontSize: 10,
  },
  aboutContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 50,
    marginTop: 1000,
    marginBottom: 200,
  },
});
