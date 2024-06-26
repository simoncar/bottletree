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
  Alert,
} from "react-native";
import { ShortList } from "@/components/sComponent";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { getAllProjects, addProjectUserAll } from "@/lib/APIproject";
import ProjectContext from "@/lib/projectContext";
import { IProject } from "@/lib/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "@/lib/authProvider";
import { useProject } from "@/lib/projectProvider";

const ModalScreen = (props) => {
  const { page } = useLocalSearchParams<{
    page: string;
  }>();
  const { sharedDataUser } = useAuth();
  const [projects, setProjects] = useState<IProject[] | null>(null);
  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();
  const { sharedDataProject, updateStoreSharedDataProject } = useProject();

  const projectsRead = (projectsDB: IProject[]) => {
    setProjects(projectsDB);
  };

  useEffect(() => {
    const unsubscribe = getAllProjects(projectsRead);
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

  function renderAdmin() {
    return (
      <View style={styles.admin}>
        <Text
          style={[
            styles.project,
            { color: Colors[colorScheme ?? "light"].background },
          ]}>
          Supervisor Mode
        </Text>
        <Text
          style={[
            styles.project,
            { color: Colors[colorScheme ?? "light"].background },
          ]}>
          (Control who can see what projects)
        </Text>
      </View>
    );
  }

  const saveDoneAll = () => {
    console.log("saveDoneAll - push to home");
    Alert.alert("Added to All Projects", "You can now see all projects");
  };

  const askAddAll = () => {
    Alert.alert(
      "Add Me to All Projects",
      "Are you sure?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Add",
          onPress: () => {
            addProjectUserAll(sharedDataUser, saveDoneAll);
          },
        },
      ],
      { cancelable: false },
    );
  };

  function renderAll() {
    return (
      <View style={styles.adminAll}>
        <TouchableOpacity
          key={"addAll"}
          onPress={() => {
            askAddAll();
          }}>
          <Text
            style={[
              styles.project,
              { color: Colors[colorScheme ?? "light"].background },
            ]}>
            Add Me to All Projects
          </Text>
          <Text
            style={[
              styles.project,
              { color: Colors[colorScheme ?? "light"].background },
            ]}>
            (Makes testing easier)
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderTitle(data: IProject) {
    if (!data.archived) {
      return (
        <View>
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.project}>
            {data.title || ""}
          </Text>
          <Text style={styles.projectId}>{data.project || ""}</Text>
        </View>
      );
    } else {
      return (
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={styles.projectArchived}>
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
            updateStoreSharedDataProject({
              key: data.key,
              title: data.title,
              icon: data.icon,
              archived: data.archived,
            });

            router.navigate({
              pathname: "/project/[project]",
              params: {
                project: data.key,
                projectTitle: data.title,
                photoURL: data.icon,
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
          <View style={styles.projectTitle}>{renderTitle(data)}</View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.projectList}>
        <View>{renderAdmin()}</View>
        <View>{renderAll()}</View>
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
  admin: {
    alignItems: "center",
    backgroundColor: "red",
    height: 70,
    paddingTop: 10,
    textAlign: "center",
  },
  adminAll: {
    alignItems: "center",
    backgroundColor: "blue",
    height: 70,
    paddingTop: 10,
    textAlign: "center",
  },
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
    width: 300,
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
});

export default ModalScreen;
