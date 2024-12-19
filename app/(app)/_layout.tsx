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
} from "expo-router";
import React, { useEffect } from "react";
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

type SearchParams = {
  project: string;
};

// export const unstable_settings = {
//   initialRouteName: "index",
// };

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const { project } = useLocalSearchParams<SearchParams>();
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

  if (isAuthLoading) {
    return (
      <ThemeProvider
        value={colorScheme === "dark" ? myDarkTheme : myLightTheme}>
        <View style={styles.container}>
          <Text>Initial Loading... </Text>
        </View>
      </ThemeProvider>
    );
  }

  if (!session) {
    if (project) {
      return (
        <Redirect
          href={{
            pathname: "/anonymous/signIn",
            params: { project: project },
          }}
        />
      );
    } else {
      return (
        <Redirect
          href={{
            pathname: "/signIn",
          }}
        />
      );
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
