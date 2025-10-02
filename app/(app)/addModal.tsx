import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { uploadFilesAndCreateEntries } from "@/lib/APIfiles";
import { addImageFromCameraRoll } from "@/lib/APIimage";
import { addPostImage } from "@/lib/APIpost";
import { IPost, ITask, IUser } from "@/lib/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

type OptionsModalProps = {
  visible: boolean;
  onClose: () => void;
  onOptionSelect: (option: string) => void;
  project: string;
  user: IUser;
};

const AddModal = ({
  visible,
  onClose,
  onOptionSelect,
  project,
  user,
}: OptionsModalProps) => {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const pickImage = async () => {
    const multiple = true;

    addImageFromCameraRoll(
      multiple,
      "project",
      project,
      progressCallback,
      completedCallback,
    );
  };

  const progressCallback = (progress: number) => {
    console.log("progressCallback", progress);
    onClose();
  };

  const saveDone = () => {
    console.log("saveDone - push to home");
  };

  const completedCallback = (sourceDownloadURLarray) => {
    let ratio = 0.66666;
    sourceDownloadURLarray.forEach((element) => {
      if (!element.ratio) {
        element.ratio = 0.666;
      }
      return sourceDownloadURLarray;
    });

    const post: IPost = {
      key: "",
      caption: "",
      projectId: project,
      projectTitle: project,
      author: user.displayName,
      images: sourceDownloadURLarray,
      ratio: ratio,
    };

    addPostImage(post, saveDone);
  };

  const handleAddFilePress = async () => {
    console.log("handleAddFilePress1");
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: true,
      });

      console.log("handleAddFilePress2");

      if (result.type !== "cancel") {
        console.log("Selected files (modal):", result);
        uploadFilesAndCreateEntries(result, project, user);
        onClose();
      } else {
        console.log("Document picker was canceled");
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }

    console.log("handleAddFilePress3");
  };

  return (
    <Modal
      style={styles.modalOverallContainer}
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: Colors[colorScheme ?? "light"].postBackground,
            },
          ]}
        >
          <Pressable
            style={styles.option}
            onPress={() => {
              router.navigate({
                pathname: "/note",
                params: {
                  project: project,
                  post: "",
                },
              });
              onClose();
            }}
          >
            <Text style={styles.optionText}>{t("addNote")}</Text>
            <FontAwesome
              name="sticky-note-o"
              size={24}
              color={Colors[colorScheme ?? "light"].text}
            />
          </Pressable>
          <Pressable
            style={styles.option}
            onPress={() => {
              onClose();
              router.navigate({
                pathname: "/camera",
                params: {
                  project: project,
                  post: "",
                },
              });
            }}
          >
            <Text style={styles.optionText}>{t("takePhoto")}</Text>
            <FontAwesome
              name="camera"
              size={24}
              color={Colors[colorScheme ?? "light"].text}
            />
          </Pressable>
          <Pressable
            style={styles.option}
            onPress={() => {
              //onClose();
              pickImage();
            }}
          >
            <Text style={styles.optionText}>{t("addFromCameraRoll")}</Text>
            <MaterialIcons
              name="camera-roll"
              size={24}
              color={Colors[colorScheme ?? "light"].text}
            />
          </Pressable>
          <Pressable
            style={styles.option}
            onPress={() => {
              onClose();
              router.navigate({
                pathname: "/editCalendar",
                params: {
                  project: project,
                },
              });
            }}
          >
            <Text style={styles.optionText}>{t("addCalendarEvent")}</Text>
            <MaterialIcons
              name="event"
              size={24}
              color={Colors[colorScheme ?? "light"].text}
            />
          </Pressable>
          <Pressable
            style={styles.option}
            onPress={() => {
              //onClose();
              handleAddFilePress();
            }}
          >
            <Text style={styles.optionText}>{t("addFile")}</Text>
            <AntDesign
              name="file-add"
              size={24}
              color={Colors[colorScheme ?? "light"].text}
            />
          </Pressable>
          <Pressable
            style={styles.option}
            onPress={() => {
              //onClose();
              onClose();
              const newTask: ITask = {
                key: "",
                task: "",
                projectId: project,
                completed: false,
                order: 0,
              };

              router.navigate({
                pathname: "/task",
                params: { task: JSON.stringify(newTask) },
              });
            }}
          >
            <Text style={styles.optionText}>{t("addTask")}</Text>
            <MaterialIcons
              name="add-task"
              size={24}
              color={Colors[colorScheme ?? "light"].textDisabledColor}
            />
          </Pressable>
          <Pressable
            style={styles.option}
            onPress={() => {
              onClose();
              router.navigate({
                pathname: "/project/add",
              });
            }}
          >
            <Text style={styles.optionText}>{t("createNewProject")}</Text>
            <MaterialIcons
              name="add-business"
              size={24}
              color={Colors[colorScheme ?? "light"].text}
            />
          </Pressable>
          <Pressable
            style={styles.option}
            onPress={() => {
              onClose();
            }}
          >
            <Text style={styles.optionTextDisabled}></Text>
            <AntDesign
              name="close"
              size={24}
              color={Colors[colorScheme ?? "light"].text}
            />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    zIndex: 1000,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  modalOverallContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  modalContainer: {
    borderRadius: 10,
    padding: 20,
    width: "80%",
    marginBottom: 20,
    marginRight: 20,
    alignItems: "flex-end",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    width: "100%",
  },
  optionText: {
    fontSize: 14,
    textAlign: "right",
    flex: 1,
    marginRight: 10,
  },
  optionTextDisabled: {
    fontSize: 18,
    textAlign: "right",
    flex: 1,
    marginRight: 10,
    color: "lightgrey",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
  },
});

export default AddModal;
