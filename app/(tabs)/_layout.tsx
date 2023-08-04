import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, Tabs, router } from "expo-router";
import React, { useContext } from "react";
import { Pressable, useColorScheme, StyleSheet } from "react-native";
import { BigText } from "../../components/StyledText";
import { View } from "../../components/Themed";
import { UserAvatar } from "../../components/UserAvatar";
import Colors from "../../constants/Colors";
import { IUser } from "../../lib/types";
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
  const { sharedDataUser } = useContext(AuthContext);
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
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerTitle: () => (
            <BigText style={styles.headerTitle}>{appName}</BigText>
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
          title: "Add",
          tabBarButton: () => (
            <Pressable
              onPress={() => {
                openActionSheet();
              }}
              style={styles.tabButton}>
              <TabBarIcon
                style={styles.tabIcon}
                name="plus-square"
                color={"white"}
              />
            </Pressable>
          ),
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          title: "",
          headerTitle: () => (
            <BigText style={styles.headerTitle}>Calendar</BigText>
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

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 28,
  },
  tabButton: {
    alignItems: "center",
    backgroundColor: "#ec562a",
    borderRadius: 55 / 2,
    height: 55,
    justifyContent: "center",
    width: 55,
  },
  tabIcon: {
    paddingBottom: 0,
    paddingLeft: 1,
  },
});
