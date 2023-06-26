import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import ProjectProvider from "../lib/projectProvider";
import { AuthProvider } from "../lib/authContext";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "(tabs)",
};

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        FuturaBold: require("../assets/fonts/FuturaBold.otf"),
        ...FontAwesome.font,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    return (
        <>
            {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
            {!loaded && <SplashScreen />}
            {loaded && <RootLayoutNav />}
        </>
    );
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();

    const MyTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: "#FFF",
        },
    };

    return (
        <>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : MyTheme}>
                <AuthProvider>
                    <ActionSheetProvider>
                        <ProjectProvider>
                            <Stack>
                                <Stack.Screen
                                    name="(tabs)"
                                    options={{ headerShown: false }}
                                />

                                <Stack.Screen
                                    name="projects"
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
                                    name="user"
                                    options={({ navigation, route }) => ({
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
