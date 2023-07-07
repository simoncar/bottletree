import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, Slot } from "expo-router";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import ProjectProvider from "../lib/projectProvider";
import AuthProvider from "../lib/authProvider";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "(tabs)",
};

export default function App() {
    const [isReady, setReady] = React.useState(false);

    React.useEffect(() => {
        // Perform some sort of async data or asset fetching.
        setTimeout(() => {
            // When all loading is setup, unmount the splash screen component.
            SplashScreen.hideAsync();
            setReady(true);
        }, 1000);
    }, []);

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
            {isReady && <RootLayoutNav />}
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
                <ActionSheetProvider>
                    <AuthProvider>
                        <ProjectProvider>
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
                                    options={{
                                        title: "Edit",
                                        headerTitleStyle: {
                                            fontWeight: "bold",
                                        },
                                    }}
                                />
                                <Stack.Screen
                                    name="editProject"
                                    options={{
                                        title: "Project",
                                        headerTitleStyle: {
                                            fontWeight: "bold",
                                        },
                                    }}
                                />
                                <Stack.Screen
                                    name="addProject"
                                    options={{
                                        title: "Add Project",
                                        headerTitleStyle: {
                                            fontWeight: "bold",
                                        },
                                    }}
                                />
                                <Stack.Screen
                                    name="user"
                                    options={{
                                        title: "",
                                        headerTitleStyle: {
                                            fontWeight: "bold",
                                        },
                                    }}
                                />
                            </Stack>
                        </ProjectProvider>
                    </AuthProvider>
                </ActionSheetProvider>
            </ThemeProvider>
        </>
    );
}
