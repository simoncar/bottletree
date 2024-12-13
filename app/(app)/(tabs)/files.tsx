import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
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
  };

  const handleAddFilePress = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
      multiple: true,
    });

    if (result.type === "success") {
      console.log("Selected files:", result);
      // Handle the selected files (e.g., upload to server, update state, etc.)
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
      <TouchableOpacity style={styles.addButton} onPress={handleAddFilePress}>
        <Text style={styles.addButtonText}>Add File</Text>
      </TouchableOpacity>
      <FlatList
        data={predefinedFiles}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.predefinedFile}>{item}</Text>
        )}
        ListHeaderComponent={() => (
          <>
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
          </>
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
  },
  predefinedFile: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 16,
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
});
