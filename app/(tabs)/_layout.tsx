import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, Tabs } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Pressable, useColorScheme } from "react-native";
import { BigText } from "../../components/StyledText";
import { View } from "../../components/Themed";
import { UserAvatar } from "../../components/UserAvatar";
import Colors from "../../constants/Colors";
import { IUser } from "../../lib/types";
import { useAuth } from "../../lib/authContext";

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome5>["name"];
    color: string;
}) {
    return <FontAwesome5 size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { user, updateSharedData } = useAuth();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "",
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="home" color={color} />
                    ),
                    headerTitle: () => (
                        <BigText style={{ fontSize: 28 }}>One Build</BigText>
                    ),
                    headerTitleAlign: "left",
                    headerRight: () => (
                        <View>
                            <Link href="/user" asChild>
                                <Pressable>
                                    {({ pressed }) => (
                                        <UserAvatar
                                            uid="user.uid"
                                            photoURL="{user.photoURL}"
                                        />
                                    )}
                                </Pressable>
                            </Link>
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="calendar"
                options={{
                    title: "",
                    headerTitle: () => (
                        <BigText style={{ fontSize: 28 }}>Calendar</BigText>
                    ),
                    headerTitleAlign: "left",
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="calendar" color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="addPost"
                initialParams={{ currentProject: "YYYYZZZZ" }}
                options={{
                    title: "",
                    headerTitle: () => (
                        <BigText style={{ fontSize: 28 }}>Add</BigText>
                    ),
                    headerTitleAlign: "left",
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="plus-square" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
