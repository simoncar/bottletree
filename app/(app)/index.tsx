import { FloatingButton } from "@/components/FloatingButton";
import { Projects } from "@/components/Projects";
import { Logo, Text, View } from "@/components/Themed";
import { UserAvatar } from "@/components/UserAvatar";
import Colors from "@/constants/Colors";
import { About } from "@/lib/about";
import { useSession } from "@/lib/ctx";
import { Update } from "@/lib/update";
import { UserContext } from "@/lib/UserContext";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router, Stack } from "expo-router";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const colorScheme = useColorScheme();
  const { session, signOut } = useSession();
  const { user, setUser } = useContext(UserContext);
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();

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
            }
          >
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
            title={t("addProject")}
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
        <ScrollView>
          <View style={styles.updateContainer}>
            <Update />
          </View>
          <View style={styles.container}>
            <Pressable
              onPress={() => {
                console.log("Projects");
              }}
            >
              <View style={styles.instructions}>
                <Text style={styles.welcomeApp}>{t("projects")}</Text>
              </View>
            </Pressable>

            <Projects session={session as string} archived={true} />
            <View style={styles.bigGap} />
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

  instructions: {
    alignItems: "center",
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
    width: 300,
    textAlign: "center",
  },
  containerFloatingButton: {
    position: "absolute",
    bottom: 80,
    right: 10,
  },
});
