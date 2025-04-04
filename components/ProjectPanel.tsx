import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";

import SharePanel from "@/components/SharePanel";
import { Text } from "@/components/Themed";
import { getProject } from "@/lib/APIproject";
import { getUserProjectCount } from "@/lib/APIuser";
import { useSession } from "@/lib/ctx";
import { IProject, IUser } from "@/lib/types";

type ProjectProp = {
  project: string;
  title: string;
  icon: string;
  projectObj: IProject;
};

const ProjectPanel = (props: ProjectProp) => {
  const { project, title, icon, projectObj: projectObjProps } = props;
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { session } = useSession();

  const [projectObj, setProject] = useState<IProject>({
    project: "",
    key: "",
    title: title,
    icon: icon || "",
    archived: false,
    postCount: 0,
    fileCount: 0,
    taskCount: 0,
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
              if (projectObj) {
                router.navigate({
                  pathname: "/project/[project]",
                  params: {
                    project: projectObj.project,
                  },
                });
              }
            }}>
            <MaterialIcons name={"settings"} color="#999999" size={28} />
          </Pressable>
        </View>
      </View>
      <SharePanel
        project={projectObj}
        buttons={["calendar", "files", "tasks", "share"]}
      />
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
  projectAvatar: {
    borderRadius: 40 / 2,
    height: 40,
    width: 40,
    borderWidth: 1,
    borderColor: "#999999",
  },
  rightChevron: {
    paddingRight: 10,
  },
  shareText: {
    fontSize: 18,
  },
  titleText: {
    fontSize: 30,
    width: 275,
  },
});

export default ProjectPanel;
