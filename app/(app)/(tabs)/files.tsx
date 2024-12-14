import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import { Text } from "@/components/Themed";
import { getFiles } from "@/lib/APIfiles";
import { IFile } from "@/lib/types";
import Colors from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Timestamp } from "firebase/firestore";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useLocalSearchParams, router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { uploadFilesAndCreateEntries } from "@/lib/APIfiles";
import AntDesign from "@expo/vector-icons/AntDesign";

type SearchParams = {
  project: string; //project ID
  title: string;
};

export default function Files() {
  const { project, title } = useLocalSearchParams<SearchParams>();
  const [files, setFiles] = useState<IFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const colorScheme = useColorScheme();

  useEffect(() => {
    getFiles(project, (retrievedFiles) => {
      setFiles(retrievedFiles);
      console.log("getFiles:", retrievedFiles);
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
          data={files}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      <Text style={styles.predefinedFileHeader}>Examples of files to add:</Text>
      <FlatList
        data={predefinedFiles}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.predefinedFile}>
            {"\u2022"}
            {item}
          </Text>
        )}
      />
    </View>
  );
}

type FileItemProps = {
  file: IFile;
  onPress: (file: IFile) => void;
};

const FileItem = ({ file, onPress }: FileItemProps) => {
  console.log("fileItem:", file);
  const formattedDate = formatDate(file.modified);
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity style={styles.fileItem} onPress={() => onPress(file)}>
      <View style={styles.iconContainer}>
        <FontAwesome5
          name="seedling"
          size={25}
          color={Colors[colorScheme ?? "light"].text}
        />
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName}>{file.filename}</Text>
        <Text style={styles.fileDetails}>
          {file.bytes} • {formattedDate}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

function formatDate(timestamp: Timestamp) {
  const date = timestamp.toDate();
  return date.toLocaleDateString();
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
