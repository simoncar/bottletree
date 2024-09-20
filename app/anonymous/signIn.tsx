import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "@/components/Themed";
import { useSession } from "@/lib/ctx";
import { addProjectUser } from "@/lib/APIproject";
import { IUser } from "@/lib/types";
import { addLog } from "@/lib/APIlog";

type Params = {
  project: string;
};

export default function SignInAnonymously() {
  const { project } = useLocalSearchParams<Params>();
  const { signInAnonymously } = useSession();

  const anonymousUser: IUser = {
    uid: "",
    displayName: "",
    email: "",
    photoURL: "",
    project: "",
    anonymous: true,
  };

  const saveDone = (id) => {
    console.log("saveDone SignInAnonymously: ", id);
    router.replace({
      pathname: "/[project]",
      params: {
        project: project,
      },
    });
  };

  const signInAnonymouslyCallback = (session, error) => {
    if (error == "Success") {
      console.log("signInAnonymously: ", session, project);
      addLog({
        loglevel: "INFO",
        message: "Create Account Anonymously",
        user: session,
        email: null,
      });
      anonymousUser.uid = session;
      addProjectUser(project, anonymousUser, saveDone);
    } else {
      //updateSharedDataUser(null);
    }
  };

  const handleSignInAnonymously = async () => {
    try {
      signInAnonymously(signInAnonymouslyCallback);
    } catch (error) {
      console.log(error);
    } finally {
      // do something
    }
  };

  useEffect(() => {
    handleSignInAnonymously();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Initial Loading... </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    paddingTop: 100,
  },
});
