import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, Redirect, Slot } from "expo-router";
import React, { useEffect, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme, Platform } from "react-native";
import ProjectProvider from "../lib/projectProvider";
import AuthProvider, { useAuth } from "../lib/authProvider";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export { ErrorBoundary } from "expo-router";
import Colors from "../constants/Colors";
import { Text, View } from "../components/Themed";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "loading",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    FuturaBold: require("../assets/fonts/FuturaBold.otf"),
    ...FontAwesome.font,
  });

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
      background: Colors[colorScheme ?? "light"].background,
    },
  };

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  //function to return a view with padding when the app is rendered in a web browser and not a mobile device
  const WebPadding = ({ children }) => {
    if (Platform.OS === "web") {
      return (
        <View
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: Colors[colorScheme ?? "light"].background,
          }}>
          {children}
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
          }}>
          {children}
        </View>
      );
    }
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? myDarkTheme : myLightTheme}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ActionSheetProvider>
            <ProjectProvider>
              <WebPadding>
                <Stack
                  screenOptions={{
                    headerStyle: {
                      backgroundColor:
                        Colors[colorScheme ?? "light"].background,
                    },
                    headerBackTitle: "Back",
                  }}>
                  <Stack.Screen
                    name="(tabs)"
                    options={{
                      title: "tt Tabs",
                      headerShown: false,
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
                    name="projectListAdmin"
                    options={{
                      title: "Administration",
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
                    name="language"
                    options={{
                      title: "Language",
                    }}
                  />
                  <Stack.Screen
                    name="editPost"
                    options={{
                      title: "View",
                      headerTitleStyle: {
                        fontWeight: "bold",
                      },
                    }}
                  />
                  <Stack.Screen
                    name="viewPost"
                    options={{
                      title: "View & Zoom",
                      headerTitleStyle: {
                        fontWeight: "bold",
                      },
                    }}
                  />
                  <Stack.Screen
                    name="project/[project]"
                    options={{
                      title: "Project",
                      headerTitleStyle: {
                        fontWeight: "bold",
                      },
                    }}
                  />
                  <Stack.Screen
                    name="project/add"
                    options={{
                      title: "Add Project",
                      headerTitleStyle: {
                        fontWeight: "bold",
                      },
                    }}
                  />
                  <Stack.Screen
                    name="editCalendar"
                    options={{
                      title: "Add Event",
                      headerTitleStyle: {
                        fontWeight: "bold",
                      },
                    }}
                  />
                  <Stack.Screen
                    name="user/[uid]"
                    options={{
                      title: "app/layout/user",
                      headerTitleStyle: {
                        fontWeight: "bold",
                      },
                    }}
                  />
                  <Stack.Screen
                    name="camera.web"
                    options={{
                      title: "Take Photo",
                      headerTitleStyle: {
                        fontWeight: "bold",
                      },
                    }}
                  />
                  <Stack.Screen
                    name="note"
                    options={{
                      title: "Add Note",
                      headerTitleStyle: {
                        fontWeight: "bold",
                      },
                    }}
                  />
                </Stack>
              </WebPadding>
            </ProjectProvider>
          </ActionSheetProvider>
        </GestureHandlerRootView>
      </AuthProvider>
    </ThemeProvider>
  );
}
