import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { View, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import {
  useNavigationContainerRef,
  useLocalSearchParams,
  Stack,
  Redirect,
  router,
} from "expo-router";
import React, { useEffect, useContext, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import ProjectProvider from "@/lib/projectProvider";
import { useSession } from "@/lib/ctx";
import { UserProvider } from "@/lib/UserContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useReactNavigationDevTools } from "@dev-plugins/react-navigation";
import Colors from "@/constants/Colors";
import { useAsyncStorageDevTools } from "@dev-plugins/async-storage";
import { Text } from "@/components/Themed";
import { Back } from "@/components/Back";
import { StatusBar } from "expo-status-bar";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { addProjectUser } from "@/lib/APIproject";
import { UserContext } from "@/lib/UserContext";
import { getUser } from "@/lib/APIuser";
import { auth, db, firestore } from "@/lib/firebase";

type SearchParams = {
  posts: string;
};

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const { posts } = useLocalSearchParams<SearchParams>();
  const localParams = useLocalSearchParams();
  useAsyncStorageDevTools();
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);
  const { user, setUser } = useContext(UserContext);
  const { session, isAuthLoading } = useSession();
  const [appLoading, setAppLoading] = useState(true);

  const [fontsLoaded, error] = useFonts({
    //SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    // FuturaBold: require("../assets/fonts/FuturaBold.otf"),
    ...FontAwesome.font,
  });

  const colorScheme = useColorScheme();

  useEffect(() => {
    console.log("/(app)/_layout.tsx");
  }, []);

  const myLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors[colorScheme ?? "light"].background,
    },
  };

  const myDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Colors[colorScheme ?? "light"].background,
    },
  };

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    console.log(
      "rehydrading the userContext from session: {}{}{}{}{}{} : ",
      session,
      isAuthLoading,
      user,
      !auth().currentUser,
    );

    if (!isAuthLoading && session) {
      // Get user data from Firebase if not already loaded
      const loadUserData = async () => {
        console.log("loadUserData: ", session);

        if (session) return;
        try {
          console.log("loadUserData getUser: ", session);

          const userData = await getUser(session);
          if (userData) {
            setUser(userData);
            setAppLoading(false);
            console.log("loadUserData setAppLoading FALSE: ", userData);
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          setAppLoading(false);
        }
      };

      loadUserData();
    }
    if (!isAuthLoading && !session) {
      console.log("NEW FRESH USER: NO SESSION >> loadUserData: ", session);

      setAppLoading(false);
    }
  }, [session, user, isAuthLoading]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (isAuthLoading) {
    console.log("Layout: isAuthLoading Initial Loading...");

    return (
      <ThemeProvider
        value={colorScheme === "dark" ? myDarkTheme : myLightTheme}>
        <View style={styles.container}>
          <Text>Initial Loading... </Text>
        </View>
      </ThemeProvider>
    );
  }

  const saveDone = (id) => {
    console.log("saveDone SignInAnonymously: ", id);
    router.replace({
      pathname: "/[posts]",
      params: {
        posts: posts,
      },
    });
  };

  if (!fontsLoaded) {
    return null;
  }

  if (appLoading == false) {
    console.log("loading COMPLETE: ", appLoading);

    if (!session) {
      console.log("Layout: no session");
      console.log("Layout: localParams: ", localParams);
      if (posts) {
        console.log("Layout: project: ", posts);
        return (
          <Redirect
            href={{
              pathname: "/anonymous/signIn",
              params: { project: posts },
            }}
          />
        );
      } else {
        console.log("Layout: no project");
        return (
          <Redirect
            href={{
              pathname: "/signIn",
            }}
          />
        );
      }
    } else {
    }
  }
  return (
    <GestureHandlerRootView>
      <ThemeProvider
        value={colorScheme === "dark" ? myDarkTheme : myLightTheme}>
        <UserProvider>
          <ActionSheetProvider>
            <ProjectProvider>
              <StatusBar style="auto" />
              <Stack
                screenOptions={{
                  headerStyle: {
                    backgroundColor: Colors[colorScheme ?? "light"].background,
                  },
                }}>
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    title: "",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="index"
                  options={{
                    title: "Home",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="projectList"
                  options={{
                    presentation: "modal",
                    title: "Projects",
                  }}
                />
                <Stack.Screen
                  name="share"
                  options={{
                    presentation: "modal",
                    title: "Share",
                  }}
                />
                <Stack.Screen
                  name="projectListAdmin"
                  options={{
                    title: "Administration",
                  }}
                />
                <Stack.Screen
                  name="userList"
                  options={{
                    presentation: "modal",
                    title: "Contacts",
                  }}
                />
                <Stack.Screen
                  name="language"
                  options={{
                    title: "Language",
                  }}
                />
                <Stack.Screen
                  name="editPost"
                  options={{
                    title: "Edit",
                  }}
                />
                <Stack.Screen
                  name="viewPost"
                  options={{
                    title: "",
                  }}
                />
                <Stack.Screen
                  name="project/[project]"
                  options={{
                    title: "Project Details",
                  }}
                />
                <Stack.Screen
                  name="project/add"
                  options={{
                    title: "Add Project",
                  }}
                />
                <Stack.Screen
                  name="editCalendar"
                  options={{
                    title: "Add Event",
                  }}
                />
                <Stack.Screen
                  name="user/[uid]"
                  options={{
                    title: "User",
                  }}
                />
                <Stack.Screen
                  name="camera"
                  options={{
                    title: "Camera",
                  }}
                />
                <Stack.Screen
                  name="house"
                  options={{
                    title: "About",
                  }}
                />
                <Stack.Screen
                  name="note"
                  options={{
                    title: "Add Note",
                  }}
                />
                <Stack.Screen
                  name="log"
                  options={{
                    title: "Logs",
                  }}
                />
              </Stack>
            </ProjectProvider>
          </ActionSheetProvider>
        </UserProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     position: "relative", // Ensure proper stacking context
  //   },
  //   // If you have Animated components, contain them:
  //   animatedContainer: {
  //     position: "absolute",
  //     zIndex: 1,
  //     pointerEvents: "box-none", // Allow touches to pass through to elements below
  //   },
});
