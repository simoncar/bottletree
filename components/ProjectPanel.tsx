import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "@/constants/Colors";
import { Text } from "@/components/Themed";
import { getUserProjectCount } from "@/lib/APIuser";
import { IUser, IProject } from "@/lib/types";
import { useAuth } from "@/lib/authProvider";
import { getProject } from "@/lib/APIproject";
import ProjectContext from "@/lib/projectContext";

const Project = (props) => {
  const { project } = props;
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { sharedDataUser, updateSharedDataUser, signOut } = useAuth();
  const { sharedDataProject, updateSharedDataProject } =
    useContext(ProjectContext);
  const [projectObj, setProject] = useState<IProject>({
    project: "",
    key: "",
    title: "",
    icon: "",
    archived: false,
    postCount: 0,
  });

  useEffect(() => {
    console.log("Project panel Use effect fired: ", project);

    getProject(project || "", (projectObj) => {
      if (projectObj) {
        setProject(projectObj);
        
      }
    });
    getUserProjectCount(userProjectCountRead);
  }, [project]);

  const userProjectCountRead = (user: IUser) => {
    //updateSharedDataUser({ postCount: user.postCount });
  };

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
          if (projectObj) {
            updateSharedDataProject({
              key: projectObj.project,
            });
            router.navigate({
              pathname: "/project/[project]",
              params: {
                project: projectObj.project,
              },
            });
          }
        }}>
        <View style={styles.avatar}>
          {projectObj.icon ? (
            <Image
              style={styles.projectAvatar}
              source={projectObj.icon}></Image>
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
          router.navigate({
            pathname: "/projectList",
          });
        }}>
        <View style={styles.projectText}>
          <Text style={styles.updateText}>
            {projectObj.title || "Select Project"}
          </Text>
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
