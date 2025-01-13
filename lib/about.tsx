import React, { useContext } from "react";
import { Button, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { useSession } from "@/lib/ctx";
import { auth } from "@/lib/firebase";
import { UserContext } from "@/lib/UserContext";
import { Link } from "expo-router";
import * as Application from "expo-application";
import * as Sentry from "@sentry/react-native";

export const About = () => {
  const { user } = useContext(UserContext);
  const { session } = useSession();

  if (null == user) {
    return <View />;
  } else {
    return (
      <View style={styles.aboutContainer}>
        <Text style={styles.version}>One Build</Text>
        <Text style={styles.version}>
          {Application.nativeApplicationVersion} (
          {Application.nativeBuildVersion}) | 12.app.sentry
        </Text>
        <Link
          href={{
            pathname: "/user/[uid]",
            params: { uid: session },
          }}>
          <Text style={styles.version}>Email: {user.email}</Text>
        </Link>
        <Text style={styles.version}>User Context - {user.uid}</Text>
        <Text style={styles.version}>CTX - {session}</Text>
        <Text style={styles.version}>Auth - {auth().currentUser?.uid}</Text>
        <Text style={styles.version}>{auth().currentUser?.isAnonymous}</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  aboutContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 50,
    paddingTop: 50,
  },
  version: {
    color: "grey",
    fontSize: 10,
  },
});
