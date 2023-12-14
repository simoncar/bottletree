import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React, { useEffect, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import ProjectProvider from "../lib/projectProvider";
import AuthProvider from "../lib/authProvider";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ActionSheetProvider>
              <ProjectProvider>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{
                      headerShown: false,
                    }}
                  />

                  <Stack.Screen
                    name="projectList"
                    options={{
                      presentation: "modal",
                      title: "Projects",
                      headerBackTitle: "Back",
                    }}
                  />
                  <Stack.Screen
                    name="projectListAdmin"
                    options={{
                      title: "Administration",
                      headerBackTitle: "Back",
                    }}
                  />
                  <Stack.Screen
                    name="colorList"
                    options={{
                      presentation: "modal",
                      title: "Colors",
                      headerBackTitle: "Back",
                    }}
                  />
                  <Stack.Screen
                    name="userList"
                    options={{
                      presentation: "modal",
                      title: "Users",
                      headerBackTitle: "Back",
                    }}
                  />
                  <Stack.Screen
                    name="language"
                    options={{
                      title: "Language",
                      headerBackTitle: "Back",
                    }}
                  />
                  <Stack.Screen
                    name="editPost"
                    options={{
                      title: "View",
                      headerTitleStyle: {
                        fontWeight: "bold",
                      },
                      headerBackTitle: "Back",
                    }}
                  />
                  <Stack.Screen
                    name="viewPost"
                    options={{
                      title: "View & Zoom",
                      headerTitleStyle: {
                        fontWeight: "bold",
                      },
                      headerBackTitle: "Back",
                    }}
                  />
                  <Stack.Screen
                    name="editProject"
                    options={{
                      title: "Project",
                      headerTitleStyle: {
                        fontWeight: "bold",
                      },
                      headerBackTitle: "Back",
                    }}
                  />
                  <Stack.Screen
                    name="addProject"
                    options={{
                      title: "Add Project",
                      headerTitleStyle: {
                        fontWeight: "bold",
                      },
                      headerBackTitle: "Back",
                    }}
                  />
                  <Stack.Screen
                    name="editCalendar"
                    options={{
                      title: "Add Event",
                      headerTitleStyle: {
                        fontWeight: "bold",
                      },
                      headerBackTitle: "Back",
                    }}
                  />
                  <Stack.Screen
                    name="user"
                    options={{
                      title: "",
                      headerTitleStyle: {
                        fontWeight: "bold",
                      },
                      headerBackTitle: "Back",
                    }}
                  />
                  <Stack.Screen
                    name="camera"
                    options={{
                      title: "Take Photo",
                      headerTitleStyle: {
                        fontWeight: "bold",
                      },
                      headerBackTitle: "Back",
                    }}
                  />
                  <Stack.Screen
                    name="note"
                    options={{
                      title: "Add Note",
                      headerTitleStyle: {
                        fontWeight: "bold",
                      },
                      headerBackTitle: "Back",
                    }}
                  />
                </Stack>
              </ProjectProvider>
            </ActionSheetProvider>
          </GestureHandlerRootView>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
