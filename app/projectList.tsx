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
import { ShortList } from "../components/sComponent";
import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import { getProjects } from "../lib/APIproject";
import ProjectContext from "../lib/projectContext";
import { IProject } from "../lib/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth, appSignIn } from "../lib/authProvider";

const ModalScreen = (props) => {
  const { page } = useLocalSearchParams<{
    page: string;
  }>();
  const { sharedDataUser } = useAuth();
  const uid = sharedDataUser?.uid;
  const [projects, setProjects] = useState<IProject[] | null>(null);
  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();
  const { updateSharedDataProject } = useContext(ProjectContext);

  const projectsRead = (projectsDB: IProject[]) => {
    setProjects(projectsDB);
  };

  useEffect(() => {
    const unsubscribe = getProjects(uid, projectsRead);
    unsubscribe;
    return () => {
      // unsubscribe;
    };
  }, []);

  useEffect(() => {
    if (projects !== null && loading === true) {
      setLoading(false);
    }
  }, [projects]);

  function renderAdd() {
    return (
      <TouchableOpacity
        key={"addProject"}
        onPress={() => {
          router.replace({
            pathname: "/addProject",
            params: {
              project: "post.projectId",
            },
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
      return <Text style={styles.project}>{data.title || ""}</Text>;
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
    return (
      <View key={data.key} style={styles.outerView}>
        <TouchableOpacity
          key={data.key}
          style={styles.innerView}
          onPress={() => {
            updateSharedDataProject({
              key: data.key,
              title: data.title,
              icon: data.icon,
              archived: data.archived,
            });

            router.push({
              pathname: "/" + page,
              params: {
                projectId: data.key,
                title: data.title,
                icon: data.icon,
                archived: data.archived,
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
          <View>{renderTitle(data)}</View>
        </TouchableOpacity>
        <View style={styles.redCircle}></View>
        <TouchableOpacity
          key={"chevron." + data.key}
          onPress={() => {
            updateSharedDataProject({
              key: data.key,
              title: data.title,
              icon: data.icon,
              archived: data.archived,
            });
            console.log("Edit Project: ", data.archived);

            router.replace({
              pathname: "/editProject",
              params: {
                projectId: data.key,
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
    <View style={styles.container}>
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
  projectList: {},

  redCircle: {
    alignItems: "center",
    backgroundColor: "red",
    borderRadius: 15 / 2,
    height: 15,
    justifyContent: "center",
    marginRight: 15,
    width: 15,
  },
  rightChevron: {
    marginHorizontal: 8,
  },
});

export default ModalScreen;
