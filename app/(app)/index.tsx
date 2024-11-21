import React, { useContext } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from "react-native";
import { useSession } from "@/lib/ctx";
import { router, Link, Stack } from "expo-router";
import { Text, View } from "@/components/Themed";
import { UserContext } from "@/lib/UserContext";
import Colors from "@/constants/Colors";
import { About } from "@/lib/about";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Projects } from "@/components/Projects";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const colorScheme = useColorScheme();
  const { session, signOut } = useSession();
  const { setUser } = useContext(UserContext);

  function renderAddProject() {
    return (
      <View style={styles.containerAdd}>
        <Link
          href={{
            pathname: "/project/add",
          }}>
          <View style={styles.createBtn}>
            <Text style={styles.createText}>+ Create Project</Text>
          </View>
        </Link>
      </View>
    );
  }

  function renderLogout() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          key={"signOut"}
          onPress={() => {
            signOut();
            setUser(null);
            router.replace("/signIn");
          }}>
          <View style={styles.logout}>
            <MaterialIcons
              name="logout"
              size={25}
              color={Colors[colorScheme ?? "light"].text}
            />
            <Text style={styles.settingName}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <SafeAreaView>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
          />

          <View style={styles.instructions}>
            <Text style={styles.welcomeApp}>Welcome to Builder</Text>
          </View>

          <Projects session={session as string} archived={false} />
          {renderAddProject()}
          <View style={styles.bigGap} />
          {renderLogout()}
          <About />
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bigGap: {
    paddingTop: 400,
  },
  container: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 10,
  },
  containerAdd: {
    alignItems: "center",
    flex: 1,
    paddingTop: 40,
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
    alignItems: "flex-start",
    paddingTop: 20,
  },
  logout: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 8,
  },
  settingName: {
    fontSize: 20,
    paddingLeft: 20,
  },
  welcomeApp: {
    fontSize: 38,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
  },
});
