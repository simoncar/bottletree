import React, { useContext, useState, useEffect } from "react";
import { Button, Pressable, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { useSession } from "@/lib/ctx";
import { auth } from "@/lib/firebase";
import { UserContext } from "@/lib/UserContext";
import { Link } from "expo-router";
import * as Application from "expo-application";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";

export const About = () => {
  const { user } = useContext(UserContext);
  const { session } = useSession();
  const [authUser, setAuthUser] = useState<string>(null);

  useEffect(() => {
    setAuthUser(auth().currentUser?.uid);
  }, []);

  const router = useRouter();
  let pressCount = 0;

  const handlePress = () => {
    pressCount += 1;
    console.log(pressCount);

    if (pressCount === 3) {
      router.push("/p");
    }
  };

  return (
    <View style={styles.aboutContainer}>
      <Pressable onPress={handlePress}>
        <Text style={styles.version}>One Build</Text>
      </Pressable>

      <Text style={styles.version}>
        {Application.nativeApplicationVersion} ({Application.nativeBuildVersion}
        ) | 12.app.sentry
      </Text>
      <Text style={styles.version}>Email: {user?.email}</Text>
      <Text style={styles.version}>Name: {user?.displayName}</Text>
      <Text style={styles.version}>User Context - {user?.uid}</Text>
      <Text style={styles.version}>Session - {session}</Text>
      <Text style={styles.version}>Auth - {auth().currentUser?.uid}</Text>
    </View>
  );
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
