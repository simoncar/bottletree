import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { getLocales } from "expo-localization";
import { Text, View } from "@/components/Themed";
import * as Application from "expo-application";
import { useAuth } from "@/lib/authProvider";
import { getToken } from "@/lib/APINotification";
import { auth } from "@/lib/firebase";

export const About = () => {
  const { sharedDataUser } = useAuth();
  const [token, setToken] = useState("");
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

  if (null == sharedDataUser) {
    return (
      <View>
        <Text style={styles.version}>About</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.aboutContainer}>
        <Text style={styles.version}>{sharedDataUser.providerData}</Text>
        <Text style={styles.version}>{sharedDataUser.displayName}</Text>
        <Text style={styles.version}>{sharedDataUser.email}</Text>
        <Text style={styles.version}>
          {Application.nativeApplicationVersion} (
          {Application.nativeBuildVersion})
        </Text>
        <Text style={styles.version}>SDU - {sharedDataUser.uid}</Text>
        <Text style={styles.version}>Auth - {auth().currentUser?.uid}</Text>
        <Text style={styles.version}>Language - {deviceLanguage}</Text>
        <Text style={styles.version}>Project - {sharedDataUser.project}</Text>
        <Text style={styles.version}>
          Dev.native - {__DEV__ ? "true" : "false"}
        </Text>
        <Text style={styles.version}>Toekn - {token}</Text>
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
