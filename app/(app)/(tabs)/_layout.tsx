import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, Tabs, useLocalSearchParams, router } from "expo-router";
import React, { useContext } from "react";
import { Pressable, useColorScheme, StyleSheet, View } from "react-native";
import { BigText } from "@/components/StyledText";
import { UserAvatar } from "@/components/UserAvatar";
import Colors from "@/constants/Colors";
import { IPost } from "@/lib/types";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { addImageFromCameraRoll } from "@/lib/APIimage";
import { addPostImage } from "@/lib/APIpost";
import { useSession } from "@/lib/ctx";
import { Text } from "@/components/Themed";
import alert from "@/lib/alert";
import { UserContext } from "@/lib/UserContext";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome5>["name"];
  color: string;
  style?: any;
}) {
  return <FontAwesome5 size={28} style={{ marginBottom: -3 }} {...props} />;
}

type SearchParams = {
  project: string;
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useContext(UserContext);
  const { isAuthLoading } = useSession();
  const { showActionSheetWithOptions } = useActionSheet();
  const { project } = useLocalSearchParams<SearchParams>();
  //const project = "project";

  if (isAuthLoading) {
    return <Text>Loading</Text>;
  }

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
    console.log("progressCallback", progress);
  };

  const completedCallback = (sourceDownloadURLarray) => {
    let ratio = 0.66666;
    sourceDownloadURLarray.map((element) => {
      const myArray = element.split("*");
      if (myArray[0] > ratio) {
        ratio = myArray[0];
      }

      return myArray;
    });

    const post: IPost = {
      key: "",
      caption: "",
      projectId: project,
      projectTitle: project,
      author: user.displayName,
      images: sourceDownloadURLarray,
      ratio: ratio,
    };

    addPostImage(post, saveDone);
  };

  const createProject = () => {
    alert("Alert", "Begin by creating a project.");
    router.navigate({
      pathname: "/project/add",
    });
  };

  const openActionSheet = async () => {
    const dateBegin = new Date();
    dateBegin.setMinutes(0);
    const dateEnd = new Date();
    dateEnd.setMinutes(0);
    dateEnd.setHours(dateEnd.getHours() + 1);

    let options = [];

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
            if (!project) {
              createProject();
              return;
            }

            router.navigate({
              pathname: "/note",
              params: {
                project: project,
                post: "",
              },
            });
            break;
          case 1:
            if (!project) {
              createProject();
              return;
            }
            router.navigate({
              pathname: "/camera",
              params: {
                project: project,
                post: "",
              },
            });
            break;
          case 2:
            if (!project) {
              createProject();
              return;
            }
            pickImage();
            break;
          case 3:
            if (!project) {
              createProject();
              return;
            }
            router.navigate({
              pathname: "/editCalendar",
              params: {
                project: project,
              },
            });
            break;
          case 4:
            router.navigate({
              pathname: "/project/add",
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
          tabPress: () => {
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
            <Link href="/">
              <View style={styles.titleView}>
                <FontAwesome5
                  name="chevron-left"
                  size={23}
                  color={Colors[colorScheme ?? "light"].text}
                />
              </View>
            </Link>
          ),
          headerTitleAlign: "left",
          headerRight: () => (
            <View>
              <UserAvatar
                uid={user?.uid}
                photoURL={user?.photoURL}
                user={user}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="nothing"
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
    fontSize: 33,
    fontWeight: "bold",
    paddingLeft: 5,
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
  titleView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
