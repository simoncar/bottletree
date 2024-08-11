import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
      <Pressable
        style={styles.pressableShare}
        onPress={() => {
          router.navigate({
            pathname: "/share",
            //params: { project: project },
          });
        }}>
        <View
          style={[
            styles.outerView,
            {
              backgroundColor: Colors[colorScheme ?? "light"].projectPanel,
            },
          ]}>
          <View style={styles.avatar}>
            <View style={styles.projectAvatar}>
              <MaterialIcons
                name="link"
                color="#999999"
                style={styles.avatarIcon}
              />
            </View>
          </View>
          <Text style={styles.share}>Share Project</Text>
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
  pressableShare: {},

  projectAvatar: { borderRadius: 35 / 2, height: 35, width: 35 },
  projectText: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },

  rightChevron: {
    marginHorizontal: 8,
  },
  share: {
    flexDirection: "row",
    flex: 1,
    fontSize: 18,
  },
  updateText: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 12,
  },
});

export default ProjectPanel;
