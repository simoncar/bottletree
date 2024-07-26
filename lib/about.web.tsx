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
  const deviceLanguage = getLocales()[0].languageCode;

  if (null == user) {
    return (
      <View>
        <Text style={styles.version}>About</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.aboutContainer}>
        <Text style={styles.version}>{user.providerData}</Text>
        <Text style={styles.version}>{user.displayName}</Text>
        <Text style={styles.version}>{user.email}</Text>
        <Text style={styles.version}>
          {Application.nativeApplicationVersion} (
          {Application.nativeBuildVersion})
        </Text>
        <Text style={styles.version}>SDU - {user.uid}</Text>
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
