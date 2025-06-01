import React from "react";
import { Stack } from "expo-router";
import Colors from "@/constants/Colors";
import { useColorScheme } from "react-native";

import { Back } from "@/components/Back";
import { StatusBar } from "expo-status-bar";
import { UserProvider } from "@/lib/UserContext";

export default function Layout() {
  const colorScheme = useColorScheme();


  return (
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
  );
}
