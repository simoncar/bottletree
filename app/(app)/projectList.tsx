import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import { ShortList } from "@/components/sComponent";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { getProjects } from "@/lib/APIproject";
import { IProject } from "@/lib/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getRelativeTime } from "@/lib/util";
import { UserContext } from "@/lib/UserContext";

const ProjectList = () => {
  const { user, setUser } = useContext(UserContext);
  const [projects, setProjects] = useState<IProject[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const colorScheme = useColorScheme();

  const projectsRead = (projectsDB: IProject[]) => {
    setProjects(projectsDB);
  };

  useEffect(() => {
    getProjects(user.uid, true, projectsRead);
  }, []);

  useEffect(() => {
    if (projects !== null && loading === true) {
      setLoading(false);
    }
  }, [projects]);

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

  function renderAdd() {
    return (
      <TouchableOpacity
        key={"addProject"}
        onPress={() => {
          router.replace({
            pathname: "/project/add",
          });
        }}>
        <View style={styles.outerView}>
          <View style={styles.innerView}>
            <View style={styles.avatar}>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome5
                    name="plus"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </View>
            <View>
              <Text style={styles.project}>Add Project</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function renderTitle(data: IProject) {
    if (!data.archived) {
      return (
        <View>
          <Text style={styles.project}>{data.title || ""}</Text>

          <Text style={styles.projectId}>
            {getRelativeTime(data.timestamp?.toDate()?.getTime() ?? 0)}
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

    const postCountUser = findValueByKey(user.postCount, data.key);
    const postCountDelta = data.postCount - postCountUser;

    return (
      <View key={data.key} style={styles.outerView}>
        <TouchableOpacity
          key={data.key}
          style={styles.innerView}
          onPress={() => {
            if (user.postCount !== undefined) {
              user.postCount[data.key] = data.postCount;
            }

            setUser({ ...user, project: data.key });

            router.navigate({
              pathname: "/[project]",
              params: {
                project: data.key,
              },
            });
          }}>
          <View style={styles.avatar}>
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
          </View>
          <View style={styles.projectTitle}>{renderTitle(data)}</View>
        </TouchableOpacity>

        {postCountDelta > 0 && (
          <View>
            <View style={styles.redCircle}>
              <Text style={styles.redNumber}>{postCountDelta}</Text>
            </View>
          </View>
        )}
        <TouchableOpacity
          key={"chevron." + data.key}
          onPress={() => {
            router.replace({
              pathname: "/project/[project]",
              params: {
                project: data.key,
                projectTitle: data.title,
                photoURL: data.icon,
                archived: data.archived,
              },
            });
          }}>
          <View style={styles.rightChevron}>
            <FontAwesome5
              name="chevron-right"
              size={25}
              color={Colors[colorScheme ?? "light"].text}
            />
          </View>
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
      <ScrollView style={styles.projectList}>
        <View>{renderAdd()}</View>
        {loading === false && (
          <View>
            <ShortList
              key={projects.key}
              data={projects}
              renderItem={renderRow}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    marginRight: 12,
    width: 50,
  },
  avatarFace: {
    borderColor: "lightgrey",
    borderRadius: 48 / 2,
    borderWidth: StyleSheet.hairlineWidth,
    height: 48,
    width: 48,
  },

  avatarIcon: {
    fontSize: 35,
    paddingTop: 5,
    textAlign: "center",
  },
  container: {
    flex: 1,
    height: 200,
  },

  innerView: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",

    paddingHorizontal: 8,
  },
  outerView: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    height: 80,
    paddingVertical: 8,
    padding: 8,
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
  projectList: {},
  projectTitle: {
    width: 250,
  },
  redCircle: {
    alignItems: "center",
    backgroundColor: "red",
    borderRadius: 25 / 2,
    height: 25,
    justifyContent: "center",
    marginRight: 25,
    width: 25,
  },

  redNumber: {
    color: "white",
  },
  rightChevron: {
    marginHorizontal: 8,
  },
});

export default ProjectList;
