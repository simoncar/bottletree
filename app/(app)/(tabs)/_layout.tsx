import { Tabs, useLocalSearchParams, router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useContext, useEffect, useState } from "react";
import {
  Pressable,
  useColorScheme,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { UserAvatar } from "@/components/UserAvatar";
import Colors from "@/constants/Colors";
import { useSession } from "@/lib/ctx";
import { Text } from "@/components/Themed";
import { Back } from "@/components/Back";
import { UserContext } from "@/lib/UserContext";
import AddModal from "@/app/(app)/addModal";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";

function TabBarIcon({
  name,
  color,
  style,
  IconComponent,
}: {
  name: string;
  color: string;
  style?: any;
  IconComponent?: React.ComponentType<{
    name: string;
    color: string;
    size: number;
  }>;
}) {
  return (
    <IconComponent
      size={28}
      style={{ marginBottom: 0 }}
      name={name}
      color={color}
      {...style}
    />
  );
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
  const { t } = useTranslation();

  useEffect(() => {
    console.log("/(app)/(tabs)/_layout.tsx");
  }, []);

  if (isAuthLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  const handleOptionSelect = (option: string) => {
    console.log("Selected option:", option);
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
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

          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="home"
              color={color}
              IconComponent={FontAwesome5}
            />
          ),
          headerLeft: () => (
            <View style={styles.back}>
              <Back />
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="[posts]"
          listeners={{
            tabPress: () => {
              router.replace({
                pathname: "/(app)",
                params: {
                  page: "",
                },
              });
            },
          }}
          options={{
            title: t("projects"),
            headerRight: () => (
              <View style={styles.topPanelRight}>
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
          name="calendar"
          options={{
            title: t("calendar"),

            tabBarIcon: ({ color }) => (
              <TabBarIcon
                name="calendar"
                color={color}
                IconComponent={FontAwesome5}
              />
            ),
          }}
          initialParams={{ project: project }}
        />
        <Tabs.Screen
          name="files"
          initialParams={{ project: project }}
          options={{
            title: t("files"),
            tabBarIcon: ({ color }) => (
              <TabBarIcon
                name="file-present"
                color={color}
                IconComponent={MaterialIcons}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          initialParams={{ project: project }}
          options={{
            title: t("tasks"),
            tabBarIcon: ({ color }) => (
              <TabBarIcon
                name="add-task"
                color={color}
                IconComponent={MaterialIcons}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="nothing"
          options={{
            title: t("add"),
            tabBarButton: (props) => (
              <Pressable
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                <FontAwesome5
                  size={40}
                  style={{
                    paddingLeft: 30,
                    marginBottom: 5,
                  }}
                  name="plus-circle"
                  color={Colors[colorScheme ?? "light"].text}
                />
              </Pressable>
            ),
          }}
        />
      </Tabs>
      <View style={{ zIndex: 9999 }}>
        <AddModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onOptionSelect={handleOptionSelect}
          project={project}
          user={user}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 33,
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
  topPanelRight: {
    paddingRight: 6,
    paddingBottom: 0,
  },
  back: {
    paddingLeft: 10,
  },
  tabBarIcon: {
    paddingBottom: 10,
    paddingLeft: 1,
  },
});
