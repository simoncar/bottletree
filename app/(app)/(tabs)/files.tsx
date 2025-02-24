import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
  Pressable,
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

type SearchParams = {
  project: string; //project ID
};

export default function Files() {
  const { project } = useLocalSearchParams<SearchParams>();
  const [files, setFiles] = useState<IFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const colorScheme = useColorScheme();

  const row: Array<any> = [];
  let prevOpenedRow;

  useEffect(() => {
    getFiles(project, (retrievedFiles) => {
      setFiles(retrievedFiles);
      setLoading(false);
    });
  }, []);

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

      if (result.type != "cancel") {
        console.log("Selected files:", result);
        Toast.show({
          type: "success",
          text1: "File Adding",
          text2: "Your file is being added to the project",
          position: "bottom",
        });
        uploadFilesAndCreateEntries(result, project);
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
        return "file-image";
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
        <Reanimated.View style={styleAnimation}>
          <Pressable
            style={styles.rightDeleteBox}
            onPress={() => {
              // deleteProjectUser(project, data, deleteDone);
              console.log("delete file");
              deleteFile(project, file.key, deleteDone);
              row[file.key].close();
            }}>
            <AntDesign name="delete" size={25} color={"white"} />
            <Text style={{ color: "white" }}>Delete</Text>
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

  const renderItem = ({ item }: { item: IFile }) => (
    <FileItem file={item} onPress={handleFilePress} />
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addFile} onPress={handleAddFilePress}>
        <Text style={styles.addButtonText}>Add File</Text>
        <AntDesign
          name="addfile"
          size={24}
          color={Colors[colorScheme ?? "light"].textDisabledColor}
        />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          style={{ flex: 1 }} // Added this line
          data={files}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
      )}
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
    fontSize: 16,
    fontWeight: "bold",
    paddingRight: 10,
  },
  predefinedFile: {
    fontSize: 16,
  },
  predefinedFileHeader: {
    fontSize: 16,
    fontWeight: "bold",
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
    fontSize: 16,
    fontWeight: "500",
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
  },
});
