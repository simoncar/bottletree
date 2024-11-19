import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { ShortList } from "@/components/sComponent";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { getProjects } from "@/lib/APIproject";
import { IProject } from "@/lib/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { UserContext } from "@/lib/UserContext";

type Props = {
  session: string;
  archived: boolean;
};

export const Projects = ({ session, archived }: Props) => {
  const [projects, setProjects] = useState<IProject[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, setUser } = useContext(UserContext);
  const colorScheme = useColorScheme();

  const projectsRead = (projectsDB: IProject[]) => {
    setProjects(projectsDB);
    setLoading(false);
  };

  useEffect(() => {
    getProjects(session, archived, projectsRead);
  }, []);

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
          <Text style={styles.projectId}>
            {data.postCount > 0 ? `Posts: ${data.postCount}` : ""}
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

  function renderRow(data: IProject) {
    const icon = data.icon;

    const postCountUser = findValueByKey(user?.postCount, data.key);
    const postCountDelta = data.postCount - postCountUser;

    return (
      <View key={data.key} style={styles.outerView}>
        <TouchableOpacity
          key={data.key}
          style={styles.innerView}
          onPress={() => {
            setUser({ ...user, project: data.key });

            router.navigate({
              pathname: "/[project]",
              params: {
                project: data.key,
              },
            });
          }}>
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
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}>
      {loading === false && (
        <View>
          <ShortList
            key={projects.key}
            data={projects}
            renderItem={renderRow}
          />
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
  },
  projectArchived: {
    color: "grey",
    fontSize: 18,
    marginBottom: 5,
  },
  projectId: {
    color: "grey",
    fontSize: 14,
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
});

export default Projects;
