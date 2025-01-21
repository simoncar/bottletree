import React, { useState, useEffect, useContext } from "react";
import { StyleSheet } from "react-native";
import { getLocales } from "expo-localization";
import { Text, View } from "@/components/Themed";
import * as Application from "expo-application";
import { useSession } from "@/lib/ctx";
import { auth } from "@/lib/firebase";
import { UserContext } from "@/lib/UserContext";

export const About = () => {
  const { user } = useContext(UserContext);
  const { session } = useSession();
  const [authUser, setAuthUser] = useState<string>(null);
  const deviceLanguage = getLocales()[0].languageCode;

  useEffect(() => {
    setAuthUser(auth().currentUser?.uid);
  }, []);

  return (
    <View style={styles.aboutContainer}>
      <Text style={styles.version}>Email - {user?.email}</Text>
      <Text style={styles.version}>Name - {user?.displayName}</Text>
      <Text style={styles.version}>13.web.sentry</Text>
      <Text style={styles.version}>User Context - {user?.uid}</Text>
      <Text style={styles.version}>session - {session}</Text>
      <Text style={styles.version}>Auth2 - {authUser}</Text>
      <Text style={styles.version}>Language - {deviceLanguage}</Text>
      <Text style={styles.version}>Project - {user?.project}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  aboutContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  version: {
    color: "grey",
    fontSize: 10,
  },
});
