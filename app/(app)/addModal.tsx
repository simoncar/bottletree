import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import Colors from "@/constants/Colors";
import { addImageFromCameraRoll } from "@/lib/APIimage";
import alert from "@/lib/alert";
import { IPost, IUser } from "@/lib/types";
import { router } from "expo-router";
import { addPostImage } from "@/lib/APIpost";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

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
      "posts",
      progressCallback,
      completedCallback,
    );
  };

  const progressCallback = (progress: number) => {
    console.log("progressCallback", progress);
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

  const createProject = () => {
    alert("Alert", "Begin by creating a project.");
    router.navigate({
      pathname: "/project/add",
    });
  };

  //  "Add Note",
  //   "Take Photo",
  //   "Add from Camera Roll",
  //   "Add Calendar Event",
  //   "Add Project",
  //   "Cancel",

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
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
              onClose();
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
              onClose();
              console.log("Add File");
            }}>
            <Text style={styles.optionTextDisabled}>Add File</Text>
            <AntDesign
              name="addfile"
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
          <Pressable style={styles.closeButton} onPress={onClose}>
            <AntDesign
              name="close"
              size={24}
              color={Colors[colorScheme ?? "light"].text}
            />
          </Pressable>
        </View>
        <Text style={styles.closeButtonText}>Project:{project}</Text>
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
    backgroundColor: "white",
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
    fontSize: 18,
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
