import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";

import Colors from "@/constants/Colors";
import { Text } from "@/components/Themed";
import { getUserProjectCount } from "@/lib/APIuser";
import { IUser, IProject } from "@/lib/types";
import { useSession } from "@/lib/ctx";
import { getProject } from "@/lib/APIproject";

type ProjectProp = {
  project: string;
};

const ProjectPanel = (props: ProjectProp) => {
  const { project } = props;
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { session } = useSession();

  const [projectObj, setProject] = useState<IProject>({
    project: "",
    key: "",
    title: "",
    icon: "",
    archived: false,
    postCount: 0,
    private: false,
  });

  useEffect(() => {
    if (session) {
      getProject(project || "", (projectObj) => {
        if (projectObj) {
          setProject(projectObj);
        }
      });
      getUserProjectCount(session, userProjectCountRead);
    }
  }, [project]);

  const userProjectCountRead = (user: IUser) => {
    console.log("userProjectCountRead: ", user);

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
      <View style={[styles.outerView, { paddingTop: 10 }]}>
        <Pressable
          style={styles.pressableLeft}
          onPress={() => {
            router.navigate({
              pathname: "/share",
              params: { project: project },
            });
          }}>
          <View style={styles.avatar}>
            <MaterialIcons
              name="link"
              color="#999999"
              style={styles.avatarIcon}
            />
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            router.navigate({
              pathname: "/share",
              params: {
                project: project,
                title: projectObj.title,
              },
            });
          }}>
          <View>
            <Text style={styles.shareText}>Share</Text>
          </View>
        </Pressable>
      </View>
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
