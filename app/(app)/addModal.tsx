import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import Colors from "@/constants/Colors";
import { addImageFromCameraRoll } from "@/lib/APIimage";
import { IPost, IUser } from "@/lib/types";
import { router } from "expo-router";
import { addPostImage } from "@/lib/APIpost";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Text } from "@/components/Themed";
import * as DocumentPicker from "expo-document-picker";
import { uploadFilesAndCreateEntries } from "@/lib/APIfiles";

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
    sourceDownloadURLarray.map((element) => {
      const myArray = element.split("*");
      if (myArray[0] > ratio) {
        ratio = myArray[0];
      }

      return myArray;
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

      if (result.type != "cancel") {
        console.log("Selected files:", result);
        uploadFilesAndCreateEntries(result, project);
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
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: Colors[colorScheme ?? "light"].postBackground,
            },
          ]}>
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
            }}>
            <Text style={styles.optionText}>Add Note</Text>
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
            }}>
            <Text style={styles.optionText}>Take Photo</Text>
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
            }}>
            <Text style={styles.optionText}>Add from Camera Roll</Text>
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
            }}>
            <Text style={styles.optionText}>Add Calendar Event</Text>
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
            }}>
            <Text style={styles.optionText}>Add File</Text>
            <AntDesign
              name="addfile"
              size={24}
              color={Colors[colorScheme ?? "light"].text}
            />
          </Pressable>
          <Pressable
            style={styles.option}
            onPress={() => {
              //onClose();
              onClose();
              router.navigate({
                pathname: "/tasks",
                params: {
                  mode: "add",
                },
              });
            }}>
            <Text style={styles.optionText}>Add Task</Text>
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
            }}>
            <Text style={styles.optionText}>Create New Project</Text>
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
            }}>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
