import { Image } from "expo-image";
import { Stack, useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Pressable,
} from "react-native";
import { Text, TextInput, View } from "@/components/Themed";
import Progress from "@/components/Progress";
import { updateProject, getProject } from "@/lib/APIproject";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { addImageFromCameraRoll } from "@/lib/APIimage";
import Colors from "@/constants/Colors";
import { ProjectUsers } from "@/components/ProjectUsers";
import { ScrollView } from "react-native-gesture-handler";
import { IProject } from "@/lib/types";
import { About } from "@/lib/about";
import { useTranslation } from "react-i18next";
import ShareLinkButton from "@/components/ShareLinkButton";

export default function EditProject() {
  const [updateUsers, setUpdateUsers] = useState("");
  const [progress, setProgress] = useState(0);
  const { t } = useTranslation();
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
      }
    });
  }, []);

  const saveDone = (id: string) => {
    if (project.archived) {
      router.dismiss();
      router.push("/");
    } else {
      router.dismiss();
    }
  };

  const toggleArchive = () => {
    const updatedProject = { ...project, archived: !project.archived };
    setProject(updatedProject);
    updateProject(updatedProject, saveDone);
    router.dismiss();
  };

  const deleteProject = () => {
    console.log("delete Project");
    alert("Delete Project does not work yet.");
  };

  const progressCallback = (progress: number) => {
    setProgress(progress);
  };

  const completedCallback = (sourceDownloadURLarray) => {
    //firstly check if the images are already parsed into an array with each element having a ratio and a URL.  if the ratio is not set, set it to 0.666
    sourceDownloadURLarray.forEach((element) => {
      if (!element.ratio) {
        element.ratio = 0.666;
      }
      return sourceDownloadURLarray;
    });

    setProject({ ...project, icon: sourceDownloadURLarray[0].url });
    setProgress(0);
  };

  const pickImage = async () => {
    const multiple = false;
    addImageFromCameraRoll(
      multiple,
      "project",
      project.key,
      progressCallback,
      completedCallback,
    );
  };

  const openActionSheet = async () => {
    const options = [t("pickFromCameraRoll"), t("delete"), t("cancel")];
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
          }}
        >
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
            <TouchableOpacity
              onPressIn={() => {
                console.log("save headerRight [project]", project);
                updateProject(project, saveDone);
              }}
            >
              <Text>{t("done")}</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Progress progress={progress} />
          <View style={styles.avatarAContainer}>
            <View style={styles.avatarBView}>{profilePic()}</View>
          </View>
          <View style={styles.projectNameContainer}>
            <View style={styles.projectBox}>
              <TextInput
                style={styles.project}
                onChangeText={(text) => setProject({ ...project, title: text })}
                placeholder={t("projectTitle")}
                value={project.title}
              />
            </View>
            {project.archived && (
              <View style={styles.archiveBox}>
                <Text style={styles.archiveMessage}>
                  {t("projectArchived")}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.shareBox}>
            <ShareLinkButton project={project.key} title={project.title} />
          </View>
          <ProjectUsers project={local.project} updateUsers={updateUsers} />
          <Pressable style={styles.actionRow} onPress={toggleArchive}>
            <View style={styles.avatar}>
              <Ionicons
                name="archive"
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
            </View>
            <View>
              <Text style={styles.archiveName}>
                {project.archived === true
                  ? t("unarchiveProject")
                  : t("archiveProject")}
              </Text>
            </View>
          </Pressable>
          {project.archived === true ? (
            <Pressable style={styles.actionRow} onPress={deleteProject}>
              <View style={styles.avatar}>
                <Ionicons
                  name="archive"
                  size={25}
                  color={Colors[colorScheme ?? "light"].text}
                />
              </View>
              <View>
                <Text style={styles.archiveName}>{t("deleteProject")}</Text>
              </View>
            </Pressable>
          ) : null}

          <View style={styles.diagBox}>
            <Text style={styles.projectId}>{project.key}</Text>
            <About />
          </View>
        </View>
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
  shareBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  button: {},
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
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    zIndex: 1, // Ensure content stays below header
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
  },
  outerView: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    flexDirection: "row",
    paddingVertical: 8,
    padding: 8,
  },
  actionRow: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    paddingVertical: 8,
    padding: 8,
    height: 80,
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
  saveButton: {
    backgroundColor: "#007AFF", // iOS blue
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    zIndex: 100,
    elevation: 100, // For Android
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  animatedView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
