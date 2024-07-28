import React, { useState, useEffect, useContext } from "react";
import { StyleSheet } from "react-native";
import { getLocales } from "expo-localization";
import { Text, View } from "@/components/Themed";
import * as Application from "expo-application";
import { useSession } from "@/lib/ctx";
import { getToken } from "@/lib/APINotification";
import { auth } from "@/lib/firebase";
import { UserContext } from "@/lib/UserContext";
import { Link } from "expo-router";

export const About = () => {
  const { user } = useContext(UserContext);
  const [token, setToken] = useState("");
  const { session } = useSession();
  const deviceLanguage = getLocales()[0].languageCode;

  useEffect(() => {
    const fetchToken = async () => {
      const returnToken = await getToken();
      setToken(returnToken);
    };

    fetchToken()
      // make sure to catch any error
      .catch(console.error);
  }, []);

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
          <Text style={styles.version}>{user.displayName}</Text>
        </Link>
        <Text style={styles.version}>{user.email}</Text>
        <Text style={styles.version}>
          {Application.nativeApplicationVersion} (
          {Application.nativeBuildVersion}) | 3
        </Text>
        <Text style={styles.version}>User Context - {user.uid}</Text>
        <Text style={styles.version}>CTX - {session}</Text>
        <Text style={styles.version}>Auth - {auth().currentUser?.uid}</Text>
        <Text style={styles.version}>Language - {deviceLanguage}</Text>
        <Text style={styles.version}>Project - {user.project}</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  aboutContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  version: {
    color: "grey",
    fontSize: 14,
  },
});
