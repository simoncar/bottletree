import Colors from "@/constants/Colors";
import { addProjectUser } from "@/lib/APIproject";
import { getUser } from "@/lib/APIuser";
import { useSession } from "@/lib/ctx";
import ProjectProvider from "@/lib/projectProvider";
import { UserContext } from "@/lib/UserContext";
import { useAsyncStorageDevTools } from "@dev-plugins/async-storage";
import { useReactNavigationDevTools } from "@dev-plugins/react-navigation";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Localization from "expo-localization";
import {
  Redirect,
  Stack,
  useLocalSearchParams,
  useNavigationContainerRef,
  usePathname,
  useSegments,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";

import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";

import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/es";

import { useTranslation } from "react-i18next";

import {
  MontserratSubrayada_400Regular,
  MontserratSubrayada_700Bold,
} from "@expo-google-fonts/montserrat-subrayada";

type SearchParams = {
  posts: string;
};

SplashScreen.preventAutoHideAsync();

globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

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

  const saveDone = (id) => {
    console.log("saveDone auth from _layout: ", id);
  };

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

    if (session) {
      if (posts) {
        addProjectUser(posts, user, saveDone);
      }
    }

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
            <Stack.Screen
              name="file"
              options={{
                title: t("file"),
              }}
            />
          </Stack>
        </ProjectProvider>
      </ActionSheetProvider>
    </ThemeProvider>
  );
}
