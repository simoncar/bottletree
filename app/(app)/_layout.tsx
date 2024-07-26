import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useNavigationContainerRef, Stack, Redirect } from "expo-router";
import React, { useEffect, useRef } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme, Platform, View } from "react-native";
import ProjectProvider from "@/lib/projectProvider";
import { useSession } from "@/lib/ctx";
import { UserProvider } from "../../lib/UserContext";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useReactNavigationDevTools } from "@dev-plugins/react-navigation";
export { ErrorBoundary } from "expo-router";
import Colors from "@/constants/Colors";
import { useAsyncStorageDevTools } from "@dev-plugins/async-storage";
import { Text } from "@/components/Themed";

export const unstable_settings = {
  initialRouteName: "home",
};

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  useAsyncStorageDevTools();
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);
  const { session, isAuthLoading } = useSession();

  const [fontsLoaded, error] = useFonts({
    //SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    // FuturaBold: require("../assets/fonts/FuturaBold.otf"),
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
      ...DarkTheme.colors,
      background: Colors[colorScheme ?? "light"].background,
    },
  };

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

  if (!session) {
    console.log("_layout Redirecting to signIn");
    return <Redirect href="/signIn" />;
  }

  if (isAuthLoading) {
    console.log("_layout Loading isAuthLoading...");
    return <Text>Loading....... . . . </Text>;
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
      <GestureHandlerRootView style={{ flex: 1 }}>
        <UserProvider>
          <ActionSheetProvider>
            <ProjectProvider>
              <Stack
                screenOptions={{
                  headerStyle: {
                    backgroundColor: Colors[colorScheme ?? "light"].background,
                  },
                  headerBackTitle: "Back",
                  headerBackTitleStyle: {
                    color: Colors[colorScheme ?? "light"].text,
                  },
                }}>
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    title: "tt Tabs",
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
                    title: "Edit",
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
                    title: "User",
                    headerTitleStyle: {
                      fontWeight: "bold",
                    },
                  }}
                />
                <Stack.Screen
                  name="camera"
                  options={{
                    title: "Camera",
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
                <Stack.Screen
                  name="log"
                  options={{
                    title: "Logs",
                    headerTitleStyle: {
                      fontWeight: "bold",
                    },
                  }}
                />
              </Stack>
            </ProjectProvider>
          </ActionSheetProvider>
        </UserProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
