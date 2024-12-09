import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  Share,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

import Colors from "@/constants/Colors";
import { Text } from "@/components/Themed";
import { getUserProjectCount } from "@/lib/APIuser";
import { IUser, IProject } from "@/lib/types";
import { useSession } from "@/lib/ctx";
import { getProject } from "@/lib/APIproject";
import SharePanel from "@/components/SharePanel";

type ProjectProp = {
  project: string;
  title: string;
  projectObj: IProject;
};

const ProjectPanel = (props: ProjectProp) => {
  const { project, title, projectObj: projectObjProps } = props;
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { session } = useSession();

  const [projectObj, setProject] = useState<IProject>({
    project: "",
    key: "",
    title: title,
    icon: "",
    archived: false,
    postCount: 0,
    private: false,
  });

  useEffect(() => {
    if (session) {
      if (projectObjProps) {
        setProject(projectObjProps);
      } else {
        getProject(project || "", (projectObj) => {
          if (projectObj) {
            setProject(projectObj);
          }
        });
      }
      getUserProjectCount(session, userProjectCountRead);
    }
  }, [project]);

  const userProjectCountRead = (user: IUser) => {
    //updateSharedDataUser({ postCount: user.postCount });
  };

  return (
    <View>
      <View style={[styles.outerView, {}]}>
        <View style={[styles.innerView, {}]}>
          <Pressable
            style={styles.pressableLeft}
            onPress={() => {
              if (projectObj) {
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
            onPress={() => {
              if (projectObj) {
                router.navigate({
                  pathname: "/project/[project]",
                  params: {
                    project: projectObj.project,
                  },
                });
              }
            }}>
            <Text style={styles.titleText}>
              {projectObj.title || "Select Project"}
            </Text>
          </Pressable>
        </View>
        <View>
          <Pressable
            onPress={() => {
              router.navigate({
                pathname: "/projectList",
              });
            }}>
            <View style={styles.rightChevron}>
              <FontAwesome5
                name="angle-down"
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
            </View>
          </Pressable>
        </View>
      </View>
      <SharePanel project={projectObj} icon="link" pathname="share" />
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    marginRight: 12,
    textAlign: "center",
  },
  avatarIcon: {
    fontSize: 25,
    paddingTop: 5,
  },
  innerView: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  outerView: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    flexDirection: "row",
    paddingVertical: 8,
    padding: 8,
  },
  pressableLeft: {
    alignItems: "center",
    width: 50,
  },
  projectAvatar: { borderRadius: 35 / 2, height: 35, width: 35 },
  rightChevron: {
    paddingRight: 10,
  },
  shareText: {
    fontSize: 18,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    width: 275,
  },
});

export default ProjectPanel;
