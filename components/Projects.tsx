import { ShortList } from "@/components/sComponent";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { getProjects, setStar } from "@/lib/APIproject";
import { IProject } from "@/lib/types";
import { UserContext } from "@/lib/UserContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";

type Props = {
  session: string;
  archived: boolean;
};

export const Projects = ({ session, archived }: Props) => {
  const [projects, setProjects] = useState<IProject[] | null>(null);
  const [projectsArchive, setProjectsArchive] = useState<IProject[] | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [triggerUpdate, setTriggerUpdate] = useState<boolean>(false); // New state variable
  const { user, setUser } = useContext(UserContext);
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const projectsRead = (projectsDB: IProject[]) => {
    //loop through the projectsDB and split the array into two arrays based on the archived flag
    if (!projectsDB) {
      setProjects([]);
      setProjectsArchive([]);
      setLoading(false);
      return;
    }

    const projects = projectsDB.reduce(
      (acc, project) => {
        if (project.archived) {
          acc[1].push(project);
        } else {
          acc[0].push(project);
        }
        return acc;
      },
      [[], []],
    );

    setProjects(projects[0]);
    setProjectsArchive(projects[1]);
    setLoading(false);
  };

  useEffect(() => {
    getProjects(session, archived, projectsRead);
  }, []);

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      getProjects(session, archived, projectsRead);

      // Return function is invoked whenever the route gets out of focus.
      return () => {};
    }, []),
  );

  const setStarDone = () => {
    getProjects(session, archived, projectsRead);
  };

  function findValueByKey(
    obj: Record<string, number>,
    keyToFind: string,
  ): number {
    if (obj == undefined) {
      return 0;
    }
    const value = obj[keyToFind];
    return value !== undefined ? value : 0; // Return 0 or any default value if the key doesn't exist in the object.
  }

  function renderTitle(data: IProject) {
    if (!data.archived) {
      return (
        <View>
          <Text style={styles.project}>{data.title || ""}</Text>
          <Text style={styles.projectCount}>
            {data.postCount > 0 ? `${t("posts")} ${data.postCount}` : ""}
            {data.postCount > 0 && data.fileCount > 0 ? " · " : ""}
            {data.fileCount > 0 ? `${t("files")} ${data.fileCount}` : ""}
            {(data.postCount > 0 || data.fileCount > 0) && data.taskCount > 0
              ? " · "
              : ""}
            {data.taskCount > 0 ? `${t("tasks")} ${data.taskCount}` : ""}
          </Text>
        </View>
      );
    } else {
      return (
        <Text style={styles.projectArchived}>
          {data.title || ""} (Archived)
        </Text>
      );
    }
  }
  function updateUserPostCount(
    user: any,
    projectKey: string,
    postCount: number,
  ) {
    if (!user || !projectKey) return;

    const updatedPostCount = {
      ...user.postCount,
      [projectKey]: postCount,
    };

    setUser({
      ...user,
      project: projectKey,
      postCount: updatedPostCount,
    });
  }

  function renderRow(data: IProject) {
    const icon = data.icon;

    let postCountUser = findValueByKey(user?.postCount, data.key); // This will re-execute on state change
    const postCountDelta = data.postCount - postCountUser;
    //console.log("postCountDelta:", data.postCount, postCountUser);

    return (
      <View key={data.key} style={styles.outerView}>
        <TouchableOpacity
          key={data.key}
          style={styles.innerView}
          onPress={() => {
            updateUserPostCount(user, data.key, data.postCount);

            setTriggerUpdate((prev) => !prev); // Trigger re-render

            router.navigate({
              pathname: "/[posts]",
              params: {
                posts: data.key,
                title: data.title,
                icon: data.icon,
              },
            });
          }}
        >
          <View style={styles.avatar}>
            <View style={styles.imageContainer}>
              {icon ? (
                <Image style={styles.avatarFace} source={data.icon} />
              ) : (
                <View style={styles.avatarFace}>
                  <MaterialIcons
                    name="house-siding"
                    color="#999999"
                    style={styles.avatarIcon}
                  />
                </View>
              )}
              {postCountDelta > 0 && (
                <View style={styles.redCircle}>
                  <Text style={styles.redNumber}>{postCountDelta}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.projectTitle}>{renderTitle(data)}</View>
        </TouchableOpacity>
        {data.key !== "demo" && (
          <TouchableOpacity
            onPress={() => {
              setStar(data.key, !data.star, setStarDone);
            }}
          >
            <FontAwesome
              name={data.star ? "star" : "star-o"}
              size={24}
              color={
                data.star ? Colors[colorScheme ?? "light"].button : "lightgrey"
              }
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      {loading === false && (
        <View>
          <ShortList data={projects} renderItem={renderRow} />
          {projectsArchive && projectsArchive.length > 0 && (
            <View>
              <TouchableOpacity
                onPress={() => setShowArchived(!showArchived)}
                style={styles.collapsibleHeader}
              >
                <Text style={styles.collapsibleHeaderText}>
                  {t("archivedProjects")}
                </Text>
                <MaterialIcons
                  name={
                    showArchived ? "keyboard-arrow-up" : "keyboard-arrow-down"
                  }
                  size={24}
                  color={Colors[colorScheme ?? "light"].text}
                />
              </TouchableOpacity>
              {showArchived && (
                <ShortList data={projectsArchive} renderItem={renderRow} />
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    marginRight: 5,
    width: 110,
  },
  collapsibleHeader: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 350,
  },
  collapsibleHeaderText: {
    fontSize: 18,
  },

  avatarFace: {
    borderColor: "lightgrey",
    borderRadius: 30 / 2,
    borderWidth: StyleSheet.hairlineWidth,
    height: 100,
    width: 100,
  },
  avatarIcon: {
    fontSize: 35,
    paddingTop: 5,
    textAlign: "center",
  },
  container: {
    paddingTop: 20,
  },
  imageContainer: {
    position: "relative",
  },
  innerView: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  outerView: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    paddingVertical: 8,
    width: 350,
  },
  project: {
    fontSize: 18,
    marginBottom: 5,
    width: 210,
  },
  projectArchived: {
    color: "grey",
    fontSize: 18,
    marginBottom: 5,
  },
  projectCount: {
    color: "grey",
    fontSize: 13,
    width: 210,
  },
  projectTitle: {
    width: 250,
  },
  redCircle: {
    alignItems: "center",
    backgroundColor: "red",
    borderRadius: 25 / 2,
    height: 25,
    justifyContent: "center",
    position: "absolute",
    right: 0,
    top: 0,
    width: 25,
  },
  redNumber: {
    color: "white",
  },
  userList: {
    paddingBottom: 50,
  },
});

export default Projects;
