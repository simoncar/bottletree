import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Tabs, useLocalSearchParams, router } from "expo-router";
import React, { useContext, useState } from "react";
import { Pressable, useColorScheme, StyleSheet, View } from "react-native";
import { UserAvatar } from "@/components/UserAvatar";
import Colors from "@/constants/Colors";
import { IPost } from "@/lib/types";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { addPostImage } from "@/lib/APIpost";
import { useSession } from "@/lib/ctx";
import { Text } from "@/components/Themed";
import { Back } from "@/components/Back";
import { UserContext } from "@/lib/UserContext";
import AddModal from "@/app/(app)/addModal";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome5>["name"];
  color: string;
  style?: any;
}) {
  return <FontAwesome5 size={28} style={{ marginBottom: 0 }} {...props} />;
}

type SearchParams = {
  posts: string;
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useContext(UserContext);
  const { isAuthLoading } = useSession();
  const { posts: project } = useLocalSearchParams<SearchParams>();
  const [modalVisible, setModalVisible] = useState(false);

  if (isAuthLoading) {
    return <Text>Loading</Text>;
  }

  const handleOptionSelect = (option: string) => {
    console.log("Selected option:", option);
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tintInactive,
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },

          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerLeft: () => (
            <View style={styles.back}>
              <Back />
            </View>
          ),
        }}>
        <Tabs.Screen
          name="[posts]"
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
            title: "Projects",
            headerRight: () => (
              <UserAvatar
                uid={user?.uid}
                photoURL={user?.photoURL}
                user={user}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="calendar"
          options={{
            title: "Calendar",

            tabBarIcon: ({ color }) => (
              <TabBarIcon name="calendar" color={color} />
            ),
          }}
          initialParams={{ project: project }}
        />
        <Tabs.Screen
          name="files"
          initialParams={{ project: project }}
          options={{
            title: "Files",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="file-pdf" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="nothing"
          options={{
            title: "Add",

            tabBarButton: (props) => (
              <Pressable
                onPress={() => {
                  setModalVisible(true);
                }}>
                <FontAwesome5
                  size={40}
                  style={{
                    paddingLeft: 30,
                    marginTop: 5,
                    paddingBottom: 5,
                  }}
                  name="plus-circle"
                  color={Colors[colorScheme ?? "light"].text}
                />
              </Pressable>
            ),
          }}
        />
      </Tabs>
      <AddModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onOptionSelect={handleOptionSelect}
        project={project}
        user={user}
      />
    </View>
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
    borderRadius: 100,
    justifyContent: "center",
    width: 30,
  },
  tabIcon: {
    paddingBottom: 0,
    paddingLeft: 1,
  },
  back: {
    paddingLeft: 10,
  },
  tabBarIcon: {
    paddingBottom: 10,
    paddingLeft: 1,
  },
});
