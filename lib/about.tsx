import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import * as Application from "expo-application";
import { useAuth, appSignIn } from "../lib/authProvider";
import { getToken } from "../lib/APINotification";

export const About = () => {
  const { sharedDataUser, updateSharedData, signOut } = useAuth();
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      const returnToken = await getToken();
      setToken(returnToken);
      console.log("empToken", returnToken);
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
        <Text style={styles.version}>{sharedDataUser.displayName}</Text>
        <Text style={styles.version}>{sharedDataUser.email}</Text>

        <Text style={styles.version}>
          {Application.nativeApplicationVersion} (
          {Application.nativeBuildVersion})
        </Text>
        <Text style={styles.version}>{sharedDataUser.uid}</Text>
        <Text style={styles.version}>{token}</Text>
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
