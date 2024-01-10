import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, Tabs, Redirect, router } from "expo-router";
import React, { useContext, useState } from "react";
import { Pressable, useColorScheme, StyleSheet } from "react-native";
import { BigText } from "../../components/StyledText";
import { View } from "../../components/Themed";
import { UserAvatar } from "../../components/UserAvatar";
import Colors from "../../constants/Colors";
import { IUser } from "../../lib/types";
import { useActionSheet } from "@expo/react-native-action-sheet";
import ProjectContext from "../../lib/projectContext";
import { addImageFromCameraRoll } from "../../lib/APIimage";
import { addPostImage } from "../../lib/APIpost";
import { useAuth } from "../../lib/authProvider";
import { Text } from "../../components/Themed";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome5>["name"];
  color: string;
}) {
  return <FontAwesome5 size={28} style={{ marginBottom: -3 }} {...props} />;
}

const appName = "Notebook";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { sharedDataProject } = useContext(ProjectContext);
  const [progress, setProgress] = useState(0);

  const { sharedDataUser, isLoading } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!sharedDataUser && !isLoading) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    console.log("(tabls)/_layout/!session:", sharedDataUser);

    //return <Redirect href="/(auth)/signIn" />;
  }

  let loggedInUser: IUser = sharedDataUser;

  if (null == sharedDataUser) {
    loggedInUser = {
      uid: "",
      displayName: "",
      email: "",
      photoURL: "",
    };
  }

  const saveDone = () => {
    console.log("saveDone - push to home");

    // router.push({
    //   pathname: "/",
    //   params: {
    //     project: sharedDataProject.key,
    //     title: sharedDataProject.title,
    //   },
    // });
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
    console.log("addImageCallback >>>>>>>: ", sourceDownloadURLarray);
    let ratio = 0.66666;
    const downloadURLarray = sourceDownloadURLarray.map((element) => {
      const myArray = element.split("*");
      console.log("myArray: ", myArray);
      if (myArray[0] > ratio) {
        ratio = myArray[0];
      }

      return myArray[1]; // For example, creating a new array with each element doubled.
    });

    const post: IPost = {
      key: "",
      caption: "",
      projectId: sharedDataProject.key,
      projectTitle: sharedDataProject.title,
      author: sharedDataUser.displayName,
      images: downloadURLarray,
      ratio: ratio,
    };

    addPostImage(post, saveDone);
    setProgress(0);
  };

  const { showActionSheetWithOptions } = useActionSheet();

  const openActionSheet = async () => {
    const options = [
      "Add Note",
      "Take Photo",
      "Add from Camera Roll",
      "Add Calendar Event",
      "Cancel",
    ];
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
              pathname: "/note",
              params: {
                projectId: sharedDataProject.key,
                postId: "",
              },
            });
            break;
          case 1:
            router.push({
              pathname: "/camera",
              params: {
                pdateBegin: dateBegin,
                pdateEnd: dateEnd,
                pcolor: "#49B382",
                pcolorName: "Grass",
              },
            });
            break;
          case 2:
            pickImage();
            break;
          case 3:
            router.push({
              pathname: "/editCalendar",
              params: {
                pdateBegin: dateBegin,
                pdateEnd: dateEnd,
                pcolor: "#49B382",
                pcolorName: "Grass",
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
            router.push({
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
            pathname: "/[project]",
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
        name="calendarLarge"
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
