import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
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

  console.log("/anonymous/signIn.tsx");

  const saveDone = (id) => {
    console.log("saveDone SignInAnonymously: ", id);
    router.replace({
      pathname: "/[posts]",
      params: {
        posts: project,
      },
    });
  };

  const signInAnonymouslyCallback = (session, error) => {
    console.log("signInAnonymouslyCallback: ", session, ":", error);

    if (error == "Success") {
      console.log("signInAnonymously: ", session, project);
      addLog({
        loglevel: "INFO",
        message: "Create Account Anonymously",
        user: session,
        email: null,
      });
      anonymousUser.uid = session;
      console.log("signInAnonymouslyCallback: ", anonymousUser);
      addProjectUser(project, anonymousUser, saveDone);
    } else {
      //updateSharedDataUser(null);
    }
  };

  const handleSignInAnonymously = async () => {
    try {
      console.log("handleSignInAnonymously");

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
      <ActivityIndicator />
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
