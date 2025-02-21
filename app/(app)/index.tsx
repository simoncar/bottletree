import React, { useContext } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Pressable,
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
import { UserAvatar } from "@/components/UserAvatar";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Update } from "@/lib/update";

export default function Home() {
  const colorScheme = useColorScheme();
  const { session, signOut } = useSession();
  const { user, setUser } = useContext(UserContext);

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

  function renderTopPanel() {
    return (
      <View style={styles.topPanel}>
        <View style={styles.topPanelLeft}>
          <Pressable
            onPress={() =>
              router.navigate({
                pathname: "/house",
                params: {
                  post: "",
                },
              })
            }>
            <FontAwesome6
              name="hammer"
              size={24}
              color={Colors[colorScheme ?? "light"].text}
            />
          </Pressable>
        </View>
        <View style={styles.topPanelRight}>
          <UserAvatar uid={user?.uid} photoURL={user?.photoURL} user={user} />
        </View>
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
    <SafeAreaView>
      {renderTopPanel()}
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />

        <View style={styles.updateContainer}>
          <Update />
        </View>
        <View style={styles.container}>
          <View style={styles.instructions}>
            <Text style={styles.welcomeApp}>Projects</Text>
          </View>

          <Projects session={session as string} archived={true} />
          {renderAddProject()}
          <View style={styles.bigGap} />
          {renderLogout()}
          <About />
        </View>
      </ScrollView>
    </SafeAreaView>
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
  topPanel: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topPanelLeft: {
    flex: 1,
  },
  topPanelRight: {
    marginLeft: 16,
  },
  updateContainer: {
    paddingHorizontal: 16,
  },
  welcomeApp: {
    fontSize: 38,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
