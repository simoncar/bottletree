import React from "react";
import { Stack } from "expo-router";
import Colors from "@/constants/Colors";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Back } from "@/components/Back";
import { StatusBar } from "expo-status-bar";
import { UserProvider } from "@/lib/UserContext";

export default function Layout() {
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

  return (
    <ThemeProvider value={colorScheme === "dark" ? myDarkTheme : myLightTheme}>
      <UserProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors[colorScheme ?? "light"].background,
            },
            headerBackTitle: "",
            navigationBarColor: Colors[colorScheme ?? "light"].background,
          }}>
          <Stack.Screen
            name="signIn"
            options={{
              title: "Sign In",
            }}
          />
          <Stack.Screen
            name="signUp"
            options={{
              title: "Sign Up",
            }}
          />
          <Stack.Screen
            name="forgotPassword"
            options={{
              title: "Forgot Password",
            }}
          />
        </Stack>
      </UserProvider>
    </ThemeProvider>
  );
}
