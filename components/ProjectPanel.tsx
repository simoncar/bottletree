import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import React, { useContext } from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ProjectContext from "../lib/projectContext";
import Colors from "../constants/Colors";
import { Text } from "../components/Themed";

const Project = (props) => {
  const { project, title, icon, archived, page } = props;
  const { updateSharedDataProject } = useContext(ProjectContext);
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <View
      style={[
        styles.outerView,
        {
          backgroundColor: Colors[colorScheme ?? "light"].projectPanel,
        },
      ]}>
      <Pressable
        style={styles.pressableLeft}
        onPress={() => {
          updateSharedDataProject({
            key: project,
            title: title,
            icon: icon,
          });

          router.push({
            pathname: "/editProject",
            params: {
              projectId: project,
              projectTitle: title,
              photoURL: icon,
              pArchived: archived,
            },
          });
        }}>
        <View style={styles.avatar}>
          {icon ? (
            <Image style={styles.projectAvatar} source={icon}></Image>
          ) : (
            <View style={styles.projectAvatar}>
              <MaterialIcons
                name="house-siding"
                color="#999999"
                style={styles.avatarIcon}
              />
            </View>
          )}
        </View>
      </Pressable>
      <Pressable
        style={styles.pressableRight}
        onPress={() => {
          router.push({
            pathname: "/projectList",
            params: {
              page: page,
            },
          });
        }}>
        <View style={styles.projectText}>
          <Text style={styles.updateText}>{title || "Select Project"}</Text>
        </View>
        <View style={styles.rightChevron}>
          <FontAwesome5
            name="angle-down"
            size={25}
            color={Colors[colorScheme ?? "light"].text}
          />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    marginRight: 12,
    textAlign: "center",
    width: 50,
  },

  avatarIcon: {
    fontSize: 25,
    paddingTop: 5,
    textAlign: "center",
  },
  outerView: {
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    borderRadius: 5,
    flexDirection: "row",
    marginTop: 10,
    padding: 5,
  },
  pressableLeft: {
    alignItems: "center",
    width: 50,
  },
  pressableRight: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  projectAvatar: { borderRadius: 35 / 2, height: 35, width: 35 },

  projectText: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  rightChevron: {
    marginHorizontal: 8,
  },
  updateText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 12,
  },
});

export default Project;
