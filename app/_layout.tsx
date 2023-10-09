import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect, useCallback } from "react";
import { useColorScheme } from "react-native";
import ProjectProvider from "../lib/projectProvider";
import AuthProvider from "../lib/authProvider";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    FuturaBold: require("../assets/fonts/FuturaBold.otf"),
    ...FontAwesome.font,
  });

  const colorScheme = useColorScheme();

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#FFF",
    },
  };

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const RootLayoutNav = useCallback(async () => {
    if (fontsLoaded) {
      //await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : MyTheme}>
        <AuthProvider>
          <ActionSheetProvider>
            <ProjectProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                <Stack.Screen
                  name="projectList"
                  options={{
                    presentation: "modal",
                    title: "Projects",
                  }}
                />
                <Stack.Screen
                  name="projectListAdmin"
                  options={{
                    title: "Administration",
                  }}
                />
                <Stack.Screen
                  name="colorList"
                  options={{
                    presentation: "modal",
                    title: "Colors",
                  }}
                />
                <Stack.Screen
                  name="userList"
                  options={{
                    presentation: "modal",
                    title: "Users",
                  }}
                />
                <Stack.Screen
                  name="editPost"
                  options={() => ({
                    title: "Edit",
                    headerTitleStyle: {
                      fontWeight: "bold",
                    },
                  })}
                />

                <Stack.Screen
                  name="editProject"
                  options={() => ({
                    title: "Project",
                    headerTitleStyle: {
                      fontWeight: "bold",
                    },
                  })}
                />
                <Stack.Screen
                  name="addProject"
                  options={() => ({
                    title: "Add Project",
                    headerTitleStyle: {
                      fontWeight: "bold",
                    },
                  })}
                />
                <Stack.Screen
                  name="editCalendar"
                  options={() => ({
                    title: "Add Event",
                    headerTitleStyle: {
                      fontWeight: "bold",
                    },
                  })}
                />
                <Stack.Screen
                  name="user"
                  options={() => ({
                    title: "",
                    headerTitleStyle: {
                      fontWeight: "bold",
                    },
                  })}
                />
              </Stack>
            </ProjectProvider>
          </ActionSheetProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
