import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, Tabs, Redirect, router } from "expo-router";
import React, { useContext, useState } from "react";
import { Pressable, useColorScheme, StyleSheet, View } from "react-native";
import { BigText } from "@/components/StyledText";

import { UserAvatar } from "@/components/UserAvatar";
import Colors from "@/constants/Colors";
import { IUser, IPost } from "@/lib/types";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useProject } from "@/lib/projectProvider";
import { addImageFromCameraRoll } from "@/lib/APIimage";
import { addPostImage } from "@/lib/APIpost";
import { useAuth } from "@/lib/authProvider";
import { Text } from "@/components/Themed";
import alert from "@/lib/alert";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome5>["name"];
  color: string;
}) {
  return <FontAwesome5 size={28} style={{ marginBottom: -3 }} {...props} />;
}

const appName = "Builder";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { sharedDataProject, updateStoreSharedDataProject } = useProject();
  const [progress, setProgress] = useState(0);
  const { sharedDataUser, isLoading } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  const loggedInUser: IUser = sharedDataUser ?? {
    uid: "",
    displayName: "",
    email: "",
    photoURL: "",
    project: "",
  };

  const saveDone = () => {
    console.log("saveDone - push to home");
  };

  const pickImage = async () => {
    const multiple = true;

    addImageFromCameraRoll(
      multiple,
      "posts",
      progressCallback,
      completedCallback,
    );
  };

  const progressCallback = (progress: number) => {
    setProgress(progress);
  };

  const completedCallback = (sourceDownloadURLarray) => {
    let ratio = 0.66666;
    const downloadURLarray = sourceDownloadURLarray.map((element) => {
      const myArray = element.split("*");
      if (myArray[0] > ratio) {
        ratio = myArray[0];
      }

      return myArray;
    });

    const post: IPost = {
      key: "",
      caption: "",
      projectId: sharedDataProject.key,
      projectTitle: sharedDataProject.title,
      author: sharedDataUser.displayName,
      images: sourceDownloadURLarray,
      ratio: ratio,
    };

    addPostImage(post, saveDone);
    setProgress(0);
  };

  const createProject = () => {
    console.log("alert to create project");

    alert("Alert", "Begin by creating a project.");
    router.navigate({
      pathname: "project/add",
    });
  };

  const openActionSheet = async () => {
    const dateBegin = new Date();
    dateBegin.setMinutes(0);
    const dateEnd = new Date();
    dateEnd.setMinutes(0);
    dateEnd.setHours(dateEnd.getHours() + 1);

    let options = [];

    console.log("sharedDataProject: ", sharedDataProject);

    options = [
      "Add Note",
      "Take Photo",
      "Add from Camera Roll",
      "Add Calendar Event",
      "Add Project",
      "Cancel",
    ];

    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            if (!sharedDataProject?.key) {
              console.log("sharedDataProject not set");
              createProject();
              return;
            }

            router.navigate({
              pathname: "/note",
              params: {
                projectId: sharedDataProject.key,
                postId: "",
              },
            });
            break;
          case 1:
            if (!sharedDataProject?.key) {
              console.log("sharedDataProject not set");
              createProject();
              return;
            }
            router.navigate({
              pathname: "/camera",
              params: {
                pcolor: "#49B382",
                pcolorName: "Grass",
              },
            });
            break;
          case 2:
            if (!sharedDataProject?.key) {
              console.log("sharedDataProject not set");
              createProject();
              return;
            }
            pickImage();
            break;
          case 3:
            if (!sharedDataProject?.key) {
              console.log("sharedDataProject not set");
              createProject();
              return;
            }
            router.navigate({
              pathname: "/editCalendar",
              params: {
                pdateBegin: dateBegin,
                pdateEnd: dateEnd,
                pcolor: "#49B382",
                pcolorName: "Grass",
              },
            });
            break;
          case 4:
            router.navigate({
              pathname: "project/add",
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
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tintInactive,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          height: 80,
        },
      }}>
      <Tabs.Screen
        name="[project]"
        listeners={{
          tabPress: (e) => {
            router.navigate({
              pathname: "/projectList",
              params: {
                page: "",
              },
            });
          },
        }}
        options={{
          title: "",
          href: {
            pathname: sharedDataProject?.key,
          },
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },

          headerTintColor: "white",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
            height: 80,
          },
          headerTitle: () => (
            <BigText style={styles.headerTitle}>{appName}</BigText>
          ),
          headerTitleAlign: "left",
          headerRight: () => (
            <View>
              <Link href="user">
                <UserAvatar
                  uid={loggedInUser?.uid}
                  photoURL={loggedInUser?.photoURL}
                  displayName={loggedInUser?.displayName}
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
            // eslint-disable-next-line react-native/no-raw-text
            <BigText style={styles.headerTitle}>Calendar</BigText>
          ),
          headerTitleAlign: "left",
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar" color={color} />
          ),
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
            height: 80,
          },
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
    backgroundColor: "#5D5CE7",
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
