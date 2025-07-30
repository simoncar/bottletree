import { ShortList } from "@/components/sComponent";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { archiveAllProjects, getAllProjects } from "@/lib/APIproject";
import { updateAllUsersEmailToLowerCase } from "@/lib/APIuser";
import { useProject } from "@/lib/projectProvider";
import { IProject } from "@/lib/types";
import { UserContext } from "@/lib/UserContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const ModalScreen = (props) => {
  const { page } = useLocalSearchParams<{
    page: string;
  }>();
  const { user } = useContext(UserContext);
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

  const saveDoneAll = () => {
    console.log("saveDoneAll - push to home");
    Alert.alert("Operation Complete");
  };

  const saveFile = async () => {
    const fileUri = FileSystem.documentDirectory + "test.txt";
    await FileSystem.writeAsStringAsync(fileUri, "Hello, world!");

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      console.warn("Sharing not available");
    }
  };

  const askArchiveAll = () => {
    Alert.alert(
      "Archive All Projects",
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
            archiveAllProjects(saveDoneAll);
          },
        },
      ],
      { cancelable: false },
    );
  };

  function renderLog() {
    return (
      <View style={styles.outerView}>
        <View style={styles.innerView}>
          <Link href="log">
            <View style={styles.avatar}>
              <View style={styles.avatarFace}>
                <MaterialIcons
                  name="history"
                  color="#999999"
                  style={styles.avatarIcon}
                />
              </View>
            </View>
            <View>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={styles.project}
              >
                View Log
              </Text>
              <Text style={styles.projectId}>{""}</Text>
            </View>
          </Link>
        </View>
      </View>
    );
  }
  function renderArchiveAll() {
    if (!__DEV__) {
      return null;
    }
    return (
      <View style={styles.adminAllArchive}>
        <TouchableOpacity
          key={"archiveAll"}
          onPress={() => {
            askArchiveAll();
          }}
        >
          <Text
            style={[
              styles.project,
              { color: Colors[colorScheme ?? "light"].background },
            ]}
          >
            Archive All Projects with 0 Posts
          </Text>
          <Text
            style={[
              styles.project,
              { color: Colors[colorScheme ?? "light"].background },
            ]}
          >
            (Data Cleanup)
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderSaveFile() {
    if (!__DEV__) {
      return null;
    }
    return (
      <View style={styles.adminAllArchive}>
        <TouchableOpacity
          key={"saveFile"}
          onPress={() => {
            saveFile();
          }}
        >
          <Text
            style={[
              styles.project,
              { color: Colors[colorScheme ?? "light"].background },
            ]}
          >
            Save File
          </Text>
          <Text
            style={[
              styles.project,
              { color: Colors[colorScheme ?? "light"].background },
            ]}
          >
            (save a text file to device)
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
          style={styles.projectArchived}
        >
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
          }}
        >
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
        <View>{renderArchiveAll()}</View>
        <View>{renderSaveFile()}</View>
        <View>{renderLog()}</View>
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
  adminAll: {
    alignItems: "center",
    backgroundColor: "blue",
    height: 70,
    paddingTop: 10,
    textAlign: "center",
  },
  adminAllArchive: {
    alignItems: "center",
    backgroundColor: "green",
    height: 70,
    paddingTop: 10,
    textAlign: "center",
  },
  adminAllLog: {
    alignItems: "center",
    backgroundColor: "green",
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
