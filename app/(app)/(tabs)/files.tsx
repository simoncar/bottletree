import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
  Pressable,
  Alert,
} from "react-native";
import { Text } from "@/components/Themed";
import { deleteFile, getFiles } from "@/lib/APIfiles";
import { IFile } from "@/lib/types";
import Colors from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Timestamp } from "firebase/firestore";
import { useLocalSearchParams, router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { uploadFilesAndCreateEntries } from "@/lib/APIfiles";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { FloatingButton } from "@/components/FloatingButton";
import { setPostFile } from "@/lib/APIpost";
import { useTranslation } from "react-i18next";
import { ShortList } from "@/components/sComponent";

type SearchParams = {
  project: string; //project ID
};

export default function Files() {
  const { project } = useLocalSearchParams<SearchParams>();
  const [files, setFiles] = useState<IFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const row: Array<any> = [];
  let prevOpenedRow;

  useEffect(() => {
    getFiles(project, (retrievedFiles) => {
      setFiles(retrievedFiles);
      setLoading(false);
    });
  }, []);
  const saveDone = () => {
    console.log("Save done");
  };

  const handleFilePress = (file: IFile) => {
    // Handle file selection
    console.log("File selected:", file);
    Linking.openURL(file.url).catch((err) =>
      console.error("Failed to open file URL:", err),
    );
  };

  const handleAddFilePress = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (result.canceled != true) {
        console.log("Selected files:", result);

        uploadFilesAndCreateEntries(result, project);
        Toast.show({
          type: "success",
          text1: "File Adding",
          text2: "Your file is being added to the project",
          position: "bottom",
        });
      } else {
        console.log("Document picker was canceled");
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const predefinedFiles = [
    "Blueprints and Floor Plans",
    "Project Scope Document",
    "Building Permits and Approvals",
    "Bill of Quantities (BoQ)",
    "Master Project Timeline",
  ];

  type FileItemProps = {
    file: IFile;
    onPress: (file: IFile) => void;
  };

  const getIconName = (mimeType: string) => {
    switch (mimeType) {
      case "application/pdf":
        return "file-pdf-o";
      case "image/jpeg":
        return "file-image-o";
      case "image/png":
        return "file-image-o";
      case "application/msword":
        return "file-word-o";
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return "file-word-o";
      case "application/vnd.ms-excel":
        return "file-excel-o";
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return "file-excel-o";
      case "application/vnd.ms-powerpoint":
        return "file-powerpoint-o";
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        return "file-powerpoint-o";
      case "application/zip":
        return "file-archive-o";
      case "application/x-zip-compressed":
        return "file-archive-o";
      default:
        return "file-o";
    }
  };

  const FileIcon = ({ file }: { file: IFile }) => {
    const iconName = getIconName(file.mimeType);
    const colorScheme = useColorScheme();
    return (
      <View style={styles.iconContainer}>
        <FontAwesome
          name={iconName}
          size={24}
          color={Colors[colorScheme ?? "light"].text}
        />
      </View>
    );
  };

  const deleteDone = (id) => {
    getFiles(project, (retrievedFiles) => {
      setFiles(retrievedFiles);
      setLoading(false);
    });
  };

  const renderRightActions = (progress, dragX, data, index) => {
    return (
      <Pressable
        style={styles.rightDeleteBox}
        onPress={() => {
          //deleteProjectUser(project, data, deleteDone);
          row[index].close();
        }}>
        <AntDesign name="delete" size={25} color={"white"} />
        <Text style={{ color: "white" }}>Delete</Text>
      </Pressable>
    );
  };

  const closeRow = (index) => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  const FileItem = ({ file, onPress }: FileItemProps) => {
    const formattedDate = formatDate(file.modified);

    function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
      const styleAnimation = useAnimatedStyle(() => {
        return {
          transform: [{ translateX: drag.value + 80 }],
        };
      });

      return (
        <Reanimated.View key={file.key} style={styleAnimation}>
          <Pressable
            style={styles.rightDeleteBox}
            key={file.key}
            onPress={() => {
              // deleteProjectUser(project, data, deleteDone);
              console.log("delete file");
              Alert.alert(
                t("deleteFile"),
                t("areYouSureYouWantToDeleteThisFile"),
                [
                  {
                    text: t("cancel"),
                    style: "cancel",
                  },
                  {
                    text: t("delete"),
                    onPress: () => {
                      deleteFile(project, file.key, deleteDone);
                      row[file.key].close();
                      Toast.show({
                        type: "success",
                        text1: t("fileDeleted"),
                        position: "bottom",
                      });
                    },
                    style: "destructive",
                  },
                ],
                { cancelable: true },
              );
            }}>
            <AntDesign name="delete" size={25} color={"white"} />
            <Text style={{ color: "white" }}>{t("delete")}</Text>
          </Pressable>
        </Reanimated.View>
      );
    }

    return (
      <Swipeable
        key={file.key}
        renderRightActions={RightAction}
        rightThreshold={40}
        friction={2}
        onSwipeableOpen={() => closeRow(file.key)}
        ref={(ref) => (row[file.key] = ref)}>
        <TouchableOpacity style={styles.fileItem} onPress={() => onPress(file)}>
          <FileIcon file={file} />
          <View style={styles.fileInfo}>
            <Text style={styles.fileName}>{file.filename}</Text>
            <Text style={styles.fileDetails}>
              {bytesToHumanReadable(file.bytes)} • {formattedDate}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };
  function bytesToHumanReadable(sizeInBytes) {
    const units = ["B", "KB", "MB", "GB", "TB", "PB"];
    let size = sizeInBytes;

    for (const unit of units) {
      if (size < 1024) {
        return unit === "KB"
          ? `${Math.floor(size)} ${unit}`
          : `${size.toFixed(2)} ${unit}`;
      }
      size /= 1024;
    }
    return `${size.toFixed(2)} PB`;
  }

  function formatDate(timestamp: Timestamp) {
    const date = timestamp.toDate();
    return date.toLocaleDateString();
  }

  const renderItemShortlist = (item: IFile) => (
    <FileItem file={item} onPress={handleFilePress} />
  );

  const renderItem = ({ item }: { item: IFile }) => (
    <FileItem file={item} onPress={handleFilePress} />
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View
          style={[
            styles.postView,
            {
              backgroundColor: Colors[colorScheme ?? "light"].postBackground,
              borderColor: Colors[colorScheme ?? "light"].postBackground,
            },
          ]}>
          {/*
          <ShortList data={files} renderItem={renderItem} />
         */}
          <FlatList
            style={{ flex: 1 }}
            data={files}
            keyExtractor={(item) => item.key}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={() => <View />}
            ListFooterComponentStyle={{ marginBottom: 100 }}
            ListEmptyComponent={() => (
              <View>
                <Text style={{ textAlign: "center", padding: 16 }}>
                  No files found
                </Text>
                <Text style={styles.predefinedFileHeader}>
                  Examples of files to add:
                </Text>
                <FlatList
                  data={predefinedFiles}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <Text style={styles.predefinedFile}>
                      {"\u2022"} {item}
                    </Text>
                  )}
                />
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        </View>
      )}
      <FloatingButton
        title={t("addFile")}
        icon={<AntDesign name="addfile" size={28} color="#ffffff" />}
        onPress={handleAddFilePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 20,
    paddingRight: 10,
  },
  predefinedFile: {
    fontSize: 20,
  },

  postView: {
    borderRadius: 10,
    borderWidth: 10,
    flex: 1,
    marginBottom: 5,
    marginHorizontal: 5,
    marginTop: 5,
  },
  predefinedFileHeader: {
    fontSize: 20,
    paddingBottom: 8,
    paddingTop: 40,
  },
  rightDeleteBox: {
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    flexDirection: "column",
    justifyContent: "center",
    margin: 0,
    height: 80,
    width: 80,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 20,
  },
  fileDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#CCC",
    marginLeft: 64,
  },
  addFile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderColor: "lightgrey",
    borderRadius: 10,
    borderWidth: 1,
    width: 200,
    alignSelf: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "grey",
    width: 150,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  floatingButtonText: {
    color: "#ffffff",
    fontSize: 20,
    marginLeft: 10,
  },
});
