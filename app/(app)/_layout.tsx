import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { View, StyleSheet } from "react-native";
import {
  useNavigationContainerRef,
  useLocalSearchParams,
  usePathname,
  useSegments,
  Stack,
  Redirect,
  router,
} from "expo-router";
import React, { useEffect, useContext, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import ProjectProvider from "@/lib/projectProvider";
import { useSession } from "@/lib/ctx";
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
import { RootSiblingParent } from "react-native-root-siblings";
import {
  useFonts,
  Nunito_200ExtraLight,
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_800ExtraBold_Italic,
} from "@expo-google-fonts/nunito";

import {
  MontserratSubrayada_400Regular,
  MontserratSubrayada_700Bold,
} from "@expo-google-fonts/montserrat-subrayada";

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
  const currentPath = usePathname();
  const segments = useSegments();
  const colorScheme = useColorScheme();

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

  const [fontsLoaded] = useFonts({
    Nunito_200ExtraLight,
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_800ExtraBold_Italic,
    MontserratSubrayada_700Bold,
    MontserratSubrayada_400Regular,
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (!session) return;
      try {
        const userData = await getUser(session);
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
      setAppLoading(false);
    };

    if (!isAuthLoading) {
      if (session) {
        loadUserData();
      } else {
        setAppLoading(false);
      }
    }
  }, [session, isAuthLoading]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // Hide splash screen when fonts are ready
    }
  }, [fontsLoaded]);

  if (isAuthLoading) {
    return (
      <ThemeProvider
        value={colorScheme === "dark" ? myDarkTheme : myLightTheme}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Initial Loading... </Text>
        </View>
      </ThemeProvider>
    );
  }

  if (appLoading == false && fontsLoaded) {
    SplashScreen.hideAsync();

    if (!session) {
      if (posts) {
        console.log("Layout: Redirect to signInAnonymously");

        return (
          <Redirect
            href={{
              pathname: "/anonymous/signIn",
              params: { project: posts },
            }}
          />
        );
      } else {
        console.log("Layout: Redirect to signIn");

        return (
          <Redirect
            href={{
              pathname: "/signIn",
            }}
          />
        );
      }
    }
  }
  return (
    <ThemeProvider value={colorScheme === "dark" ? myDarkTheme : myLightTheme}>
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
            <Stack.Screen
              name="task"
              options={{
                title: "Task",
              }}
            />
          </Stack>
        </ProjectProvider>
      </ActionSheetProvider>
    </ThemeProvider>
  );
}
