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
import { Text, View, Logo } from "@/components/Themed";
import { UserContext } from "@/lib/UserContext";
import Colors from "@/constants/Colors";
import { About } from "@/lib/about";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Projects } from "@/components/Projects";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserAvatar } from "@/components/UserAvatar";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Update } from "@/lib/update";
import Toast from "react-native-toast-message";
import { FloatingButton } from "@/components/FloatingButton";
import { AntDesign } from "@expo/vector-icons";
import { SaveFormat } from "expo-image-manipulator";

export default function Home() {
  const colorScheme = useColorScheme();
  const { session, signOut } = useSession();
  const { user, setUser } = useContext(UserContext);

  const handleAddPress = async () => {
    router.navigate({
      pathname: "/project/add",
    });
  };

  function renderTopPanel() {
    return (
      <View style={styles.topPanel}>
        <View style={styles.topPanelLeft}>
          <Pressable
            onPress={() =>
              router.navigate({
                pathname: "/house",
                params: { post: "" },
              })
            }>
            <FontAwesome6
              name="hammer"
              size={24}
              color={Colors[colorScheme ?? "light"].text}
            />
          </Pressable>
        </View>

        <View style={styles.topPanelCenter}>
          <Logo style={{ fontSize: 30 }}>One</Logo>
          <Text style={{ fontSize: 25 }}> </Text>
          <Logo style={{ fontSize: 30 }}>Build</Logo>
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
    <View style={styles.overall}>
      <SafeAreaView>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View style={styles.containerFloatingButton}>
          <FloatingButton
            title="Add Project"
            icon={
              <FontAwesome6
                name="house-circle-check"
                size={28}
                color="#ffffff"
              />
            }
            onPress={handleAddPress}
          />
        </View>
        {renderTopPanel()}

        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={styles.updateContainer}>
            <Update />
          </View>
          <View style={styles.container}>
            <Pressable
              onPress={() => {
                //   Toast.show("Projects", {
                //     duration: Toast.durations.LONG,
                //     position: Toast.positions.TOP,
                //   });

                console.log("Projects");
              }}>
              <View style={styles.instructions}>
                <Text style={styles.welcomeApp}>Projects</Text>
              </View>
            </Pressable>

            <Projects session={session as string} archived={true} />
            <View style={styles.bigGap} />
            {renderLogout()}
            <About />
          </View>
        </ScrollView>
      </SafeAreaView>
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
  },
  overall: {
    flex: 1,
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
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topPanelLeft: {
    alignItems: "flex-start",
  },
  topPanelCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  topPanelRight: {
    alignItems: "flex-end",
  },
  updateContainer: {
    paddingHorizontal: 16,
  },
  welcomeApp: {
    fontSize: 40,
    marginBottom: 20,
    fontFamily: "Inter_700Bold",
  },
  containerFloatingButton: {
    position: "absolute",
    bottom: 80,
    right: 10,
    width: 150,
  },
});
