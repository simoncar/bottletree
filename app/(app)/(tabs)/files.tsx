import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { getFiles } from "@/lib/APIfiles";
import { IFile } from "@/lib/types";
import Colors from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Timestamp } from "firebase/firestore";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useLocalSearchParams, router } from "expo-router";

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

  const renderItem = ({ item }: { item: IFile }) => (
    <FileItem file={item} onPress={handleFilePress} />
  );

  return (
    <View style={styles.container}>
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
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
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
