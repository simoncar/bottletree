import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, Tabs, router } from "expo-router";
import React, { useContext } from "react";
import { Pressable, useColorScheme } from "react-native";
import { BigText, Text } from "../../components/StyledText";
import { View } from "../../components/Themed";
import { UserAvatar } from "../../components/UserAvatar";
import Colors from "../../constants/Colors";
import { IUser } from "../../lib/types";
import { useAuth } from "../../lib/authProvider";
import AuthContext from "../../lib/authContext";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as Device from "expo-device";

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome5>["name"];
    color: string;
}) {
    return <FontAwesome5 size={28} style={{ marginBottom: -3 }} {...props} />;
}

let appName = "One Build";

if (!Device.isDevice) {
    appName = "One Build (Emulator)";
}

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { sharedDataUser, updateSharedDataUser } = useContext(AuthContext);
    let loggedInUser: IUser = sharedDataUser;

    if (null == sharedDataUser) {
        loggedInUser = {
            uid: "",
            displayName: "",
            email: "",
            photoURL: "",
        };
    }

    const { showActionSheetWithOptions } = useActionSheet();

    const openActionSheet = async () => {
        const options = ["Add Photo", "Add Calendar Event", "Cancel"];
        const cancelButtonIndex = options.length - 1;
        const dateBegin = new Date();
        dateBegin.setMinutes(0);
        const dateEnd = new Date();
        dateEnd.setMinutes(0);
        dateEnd.setHours(dateEnd.getHours() + 1);

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        router.push({
                            pathname: "/addPost",
                        });
                        break;
                    case 1:
                        router.push({
                            pathname: "/editCalendar",
                            params: {
                                pdateBegin: dateBegin,
                                pdateEnd: dateEnd,
                            },
                        });
                        break;
                }
            },
        );
    };

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
                        <BigText style={{ fontSize: 28 }}>{appName}</BigText>
                    ),
                    headerTitleAlign: "left",
                    headerRight: () => (
                        <View>
                            <Link href="/user">
                                <UserAvatar
                                    uid={loggedInUser.uid}
                                    photoURL={loggedInUser.photoURL}
                                    displayName={loggedInUser.displayName}
                                />
                            </Link>
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="addPost"
                options={{
                    title: "Empty",
                    tabBarButton: ({ color }) => (
                        <Pressable
                            onPress={() => {
                                openActionSheet();
                            }}
                            style={{
                                marginTop: -9,
                                backgroundColor: "#ec562a",
                                borderRadius: 55 / 2,
                                width: 55,
                                height: 55,
                                alignItems: "center",
                                justifyContent: "center",
                                paddingLeft: 0,
                            }}>
                            <TabBarIcon name="plus-square" color={"white"} />
                        </Pressable>
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
        </Tabs>
    );
}
