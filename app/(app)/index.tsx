import React, { useState, useContext } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from "react-native";
import { useSession } from "@/lib/ctx";
import { Stack, Link } from "expo-router";
import { deleteUser } from "@/lib/APIuser";
import { Text, View } from "@/components/Themed";
import { UserContext } from "../../lib/UserContext";
import Colors from "@/constants/Colors";
import { About } from "@/lib/about";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Projects } from "@/components/Projects";

export default function Home() {
  const colorScheme = useColorScheme();
  const { session } = useSession();

  function renderAddProject() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          key={"createProject"}
          style={styles.createBtn}
          onPress={async () => {
            router.replace({
              pathname: "project/add",
            });
          }}>
          <Text style={styles.createText}>+ Create Project</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderLogout() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          key={"signOut"}
          onPress={() => {
            auth()
              .signOut()
              .then(async () => {
                await AsyncStorage.clear();
                console.log("User Storage successfully cleared!");
                console.log("Sign-out successful....");
                // clear the shared data project
                setUser(null);
                // Clear the stack and navigate to the signIn page
                router.replace("/signIn");
              })
              .catch((error) => {
                console.log("[uid] eror: ", error.message);
              });
          }}>
          <View style={styles.leftContent}>
            <MaterialIcons
              name="logout"
              size={25}
              color={Colors[colorScheme ?? "light"].text}
            />
            <Text style={styles.settingName}>Log Out</Text>
          </View>
          <View style={styles.rightChevron}></View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Stack.Screen options={{ title: "Home" }} />

        <View style={styles.instructions}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.welcomeApp}>Builder App</Text>
        </View>

        <Projects session={session as string} archived={false} />
        {renderAddProject()}
        {renderLogout()}
        <About />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  createBtn: {
    alignItems: "center",
    backgroundColor: "#9D5BD0",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    marginBottom: 40,
    width: 200,
  },

  createText: {
    color: "white",
    fontSize: 18,
  },
  instructions: {
    alignItems: "center",
  },
  leftContent: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 8,
  },
  outerView: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    height: 80,
    paddingVertical: 8,
    padding: 8,
  },
  settingName: {
    fontSize: 20,
    paddingLeft: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  welcomeApp: {
    color: "#9D5BD0",
    fontSize: 45,
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 10,
  },
});
