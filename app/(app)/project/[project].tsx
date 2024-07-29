import { Image } from "expo-image";
import { Stack, useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  TouchableOpacity,
  Button,
  useColorScheme,
  Pressable,
  Switch,
} from "react-native";

import { Text, TextInput, View } from "@/components/Themed";
import Progress from "@/components/Progress";
import { updateProject, getProject } from "@/lib/APIproject";
import { useProject } from "@/lib/projectProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { addImageFromCameraRoll } from "@/lib/APIimage";
import Colors from "@/constants/Colors";
import { ProjectUsers } from "@/components/ProjectUsers";
import { ScrollView } from "react-native-gesture-handler";
import { IProject } from "@/lib/types";

export default function Project() {
  const [updateUsers, setUpdateUsers] = useState("");
  const { sharedDataProject, updateStoreSharedDataProject } = useProject();
  const [progress, setProgress] = useState(0);

  const local = useLocalSearchParams<{
    project: string;
    pUpdateUsers: string;
  }>();

  const colorScheme = useColorScheme();
  const { showActionSheetWithOptions } = useActionSheet();

  const [project, setProject] = useState<IProject>({
    project: "",
    key: "",
    title: "",
    icon: "",
    archived: false,
    postCount: 0,
    private: false,
  });

  useEffect(() => {
    setUpdateUsers(local.pUpdateUsers);
  }, [local.pUpdateUsers]);

  useEffect(() => {
    getProject(local?.project || "", (project) => {
      if (project) {
        setProject(project);
        updateStoreSharedDataProject(project);
      }
    });
  }, []);

  const saveDone = (id: string) => {
    updateStoreSharedDataProject(project);

    router.navigate({
      pathname: "/[project]",
      params: {
        project: id,
      },
    });
  };

  const toggleArchive = () => {
    const updatedProject = { ...project, archived: !project.archived };
    setProject(updatedProject);
    updateProject(updatedProject, saveDone);
  };

  const progressCallback = (progress: number) => {
    setProgress(progress);
  };

  const completedCallback = (sourceDownloadURLarray) => {
    let ratio = 0.66666;
    const downloadURLarray = sourceDownloadURLarray.map((element) => {
      const myArray = element.split("*");
      if (myArray[0] > ratio) {
        ratio = myArray[0];
      }

      return myArray[1]; // For example, creating a new array with each element doubled.
    });

    setProject({ ...project, icon: downloadURLarray[0] });
    setProgress(0);
  };

  const pickImage = async () => {
    const multiple = false;
    addImageFromCameraRoll(
      multiple,
      "project",
      progressCallback,
      completedCallback,
    );
  };

  const openActionSheet = async () => {
    const options = ["Pick from Camera Roll", "Delete", "Cancel"];
    const destructiveButtonIndex = options.length - 2;
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            break;
          case 1:
            setProject({ ...project, icon: "" });
            break;
        }
      },
    );
  };

  const profilePic = () => {
    return (
      <View style={styles.profilePicContainer}>
        <TouchableOpacity
          onPress={() => {
            openActionSheet();
          }}>
          {project.icon ? (
            <Image style={styles.profilePhoto} source={project.icon} />
          ) : (
            <MaterialIcons
              name="house-siding"
              size={100}
              color="#999999"
              style={styles.profilePic}
            />
          )}
          <View style={styles.circle}>
            <Entypo name="camera" size={17} style={styles.camera} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Button
              title="Save"
              onPress={() => updateProject(project, saveDone)}
            />
          ),
        }}
      />
      <Progress progress={progress} />
      <View style={styles.avatarAContainer}>
        <View style={styles.avatarBView}>{profilePic()}</View>
      </View>
      <View style={styles.projectNameContainer}>
        <View style={styles.projectBox}>
          <TextInput
            style={styles.project}
            onChangeText={(text) => setProject({ ...project, title: text })}
            placeholder={"Project Title"}
            value={project.title}
          />
        </View>
        <View style={styles.archiveBox}>
          <Text style={styles.archiveMessage}>
            {project.archived == true ? "Project Archived" : ""}
          </Text>
        </View>
      </View>
      <View style={styles.outerView}>
        <View style={styles.innerView}>
          <View style={styles.avatar}>
            <Ionicons
              name="share-social"
              size={25}
              color={Colors[colorScheme ?? "light"].textPlaceholder}
            />
          </View>
          <View>
            <Text style={styles.private}>Private</Text>
          </View>
        </View>
        <View style={styles.rightChevron}>
          <Switch
            value={project.private}
            onValueChange={(value) =>
              setProject({ ...project, private: value })
            }
          />
        </View>
      </View>
      <ProjectUsers project={local.project} updateUsers={updateUsers} />
      <Pressable style={styles.outerView} onPress={toggleArchive}>
        <View style={styles.avatar}>
          <Ionicons
            name="archive"
            size={25}
            color={Colors[colorScheme ?? "light"].textPlaceholder}
          />
        </View>
        <View>
          <Text style={styles.archiveName}>
            {project.archived == true ? "Unarchive Project" : "Archive Project"}
          </Text>
        </View>
      </Pressable>
      <View style={styles.diagBox}>
        <Text style={styles.projectId}>Project ID: {project.key}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  archiveBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: "85%",
  },
  archiveMessage: {
    color: "grey",
    fontSize: 16,
    textAlign: "center",
  },
  archiveName: {
    color: "red",
    fontSize: 20,
    paddingLeft: 20,
  },
  avatar: { alignItems: "center", justifyContent: "center", width: 48 },
  avatarAContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },

  avatarBView: {},
  camera: {
    color: "white",
    marginBottom: 2,
  },

  circle: {
    alignItems: "center",
    backgroundColor: "lightgrey",
    borderColor: "white",
    borderRadius: 30 / 2,
    borderWidth: 2,
    height: 30,
    justifyContent: "center",
    left: 115,
    position: "absolute",
    top: 115,
    width: 30,
  },
  diagBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    paddingBottom: 100,
    paddingTop: 100,
  },
  innerView: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 8,
  },
  outerView: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    flexDirection: "row",
    paddingVertical: 8,
    padding: 8,
  },
  private: {
    fontSize: 20,
    paddingLeft: 20,
  },

  profilePhoto: {
    borderColor: "grey",
    borderRadius: 150 / 2,
    borderWidth: 1,
    height: 150,
    overflow: "hidden",
    width: 150,
  },
  profilePic: {
    borderColor: "lightgray",
    height: 200,
  },
  profilePicContainer: {
    alignItems: "center",
    paddingBottom: 15,
    paddingHorizontal: 15,
    paddingTop: 15,
  },

  project: {
    fontSize: 25,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
  },
  projectBox: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    width: "85%",
  },
  projectId: {
    color: "grey",
    fontSize: 12,
    textAlign: "center",
  },
  projectNameContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    paddingTop: 20,
  },
  rightChevron: {
    marginHorizontal: 8,
  },
});
