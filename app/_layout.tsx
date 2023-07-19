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

// export const unstable_settings = {
//     // Ensure that reloading on `/modal` keeps a back button present.
//     initialRouteName: "(tabs)",
// };

//SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    let [fontsLoaded, error] = useFonts({
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

    console.log("AAA");

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    const RootLayoutNav = useCallback(async () => {
        console.log("CCC");
        if (fontsLoaded) {
            console.log("BBBB");
            await SplashScreen.hideAsync();
            console.log("DDD");
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        console.log("EEE");
        return null;
    }

    console.log("FFF");
    return (
        <>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : MyTheme}>
                <ActionSheetProvider>
                    <ProjectProvider>
                        <AuthProvider>
                            <Stack>
                                <Stack.Screen
                                    name="(tabs)"
                                    options={{ headerShown: false }}
                                />

                                <Stack.Screen
                                    name="projectList"
                                    options={{
                                        presentation: "modal",
                                        title: "Projects",
                                    }}
                                />
                                <Stack.Screen
                                    name="editPost"
                                    options={({ navigation, route }) => ({
                                        title: "Edit",
                                        headerTitleStyle: {
                                            fontWeight: "bold",
                                        },
                                    })}
                                />
                                <Stack.Screen
                                    name="editProject"
                                    options={({ navigation, route }) => ({
                                        title: "Project",
                                        headerTitleStyle: {
                                            fontWeight: "bold",
                                        },
                                    })}
                                />
                                <Stack.Screen
                                    name="addProject"
                                    options={({ navigation, route }) => ({
                                        title: "Add Project",
                                        headerTitleStyle: {
                                            fontWeight: "bold",
                                        },
                                    })}
                                />
                                <Stack.Screen
                                    name="editCalendar"
                                    options={({ navigation, route }) => ({
                                        title: "Add Event",
                                        headerTitleStyle: {
                                            fontWeight: "bold",
                                        },
                                    })}
                                />
                                <Stack.Screen
                                    name="user"
                                    options={({ navigation, route }) => ({
                                        title: "",
                                        headerTitleStyle: {
                                            fontWeight: "bold",
                                        },
                                    })}
                                />
                            </Stack>
                        </AuthProvider>
                    </ProjectProvider>
                </ActionSheetProvider>
            </ThemeProvider>
        </>
    );
}
