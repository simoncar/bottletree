import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { View, StyleSheet, ActivityIndicator } from "react-native";
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
import * as Localization from "expo-localization";

import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";

import i18n from "@/lib/i18n";
import "dayjs/locale/es";
import "dayjs/locale/en";
import dayjs from "dayjs";

import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  dayjs.locale(Localization.getLocales()[0]?.languageCode || "en");

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
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    MontserratSubrayada_400Regular,
    MontserratSubrayada_700Bold,
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
          <ActivityIndicator />
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
                title: t("home"),
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="projectList"
              options={{
                presentation: "modal",
                title: t("projects"),
              }}
            />
            <Stack.Screen
              name="share"
              options={{
                presentation: "modal",
                title: t("share"),
              }}
            />
            <Stack.Screen
              name="projectListAdmin"
              options={{
                title: t("administration"),
              }}
            />
            <Stack.Screen
              name="userList"
              options={{
                presentation: "modal",
                title: t("contacts"),
              }}
            />
            <Stack.Screen
              name="language"
              options={{
                title: t("language"),
              }}
            />
            <Stack.Screen
              name="editPost"
              options={{
                title: t("edit"),
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
                title: t("project"),
              }}
            />
            <Stack.Screen
              name="project/add"
              options={{
                title: t("addProject"),
              }}
            />
            <Stack.Screen
              name="editCalendar"
              options={{
                title: t("addEvent"),
              }}
            />
            <Stack.Screen
              name="user/[uid]"
              options={{
                title: t("user"),
              }}
            />
            <Stack.Screen
              name="camera"
              options={{
                title: t("camera"),
              }}
            />
            <Stack.Screen
              name="house"
              options={{
                title: t("about"),
              }}
            />
            <Stack.Screen
              name="note"
              options={{
                title: t("addNote"),
              }}
            />
            <Stack.Screen
              name="log"
              options={{
                title: t("logs"),
              }}
            />
            <Stack.Screen
              name="task"
              options={{
                title: t("task"),
              }}
            />
          </Stack>
        </ProjectProvider>
      </ActionSheetProvider>
    </ThemeProvider>
  );
}
