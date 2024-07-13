import { Image } from "expo-image";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import { ShortList } from "@/components/sComponent";
import { Text, View } from "@/components/Themed";
import { getLogs } from "@/lib/APIlog";
import { addProjectUser } from "@/lib/APIproject";
import { ILog } from "@/lib/types";
import ProjectContext from "@/lib/projectContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/lib/authProvider";
import { useProject } from "@/lib/projectProvider";

const ModalScreen = (props) => {
  const { page } = useLocalSearchParams<{
    page: string;
  }>();

  const [logs, setLogs] = useState<ILog[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { sharedDataUser, isLoading } = useAuth();

  const logsRead = (logsDB: ILog[]) => {
    setLogs(logsDB);
  };

  useEffect(() => {
    const unsubscribe = getLogs(logsRead);
    unsubscribe;
    return () => {
      // unsubscribe;
    };
  }, []);

  function renderRow(data: ILog) {
    const backgroundColor = "transparent";
    return (
     
        <View
          key={data.key}
          style={[styles.outerView, { backgroundColor: backgroundColor }]}>
          <View style={styles.avatar}>
            <View style={styles.avatarFace}>
              <Ionicons
                name="person-outline"
                color="#999999"
                style={styles.avatarIcon}
              />
            </View>
          </View>
          <View>
            <Text style={styles.logLevel}>{data.loglevel || ""}</Text>
            <Text style={styles.message}>{data.message || ""}</Text>
          </View>
        </View>
      
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.logList}>
        {loading === false && (
          <View>
            <ShortList data={logs} renderItem={renderRow} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    marginRight: 12,
    width: 50,
  },
  avatarFace: { borderRadius: 48 / 2, height: 48, width: 48 },

  avatarIcon: {
    fontSize: 35,
    paddingTop: 5,
    textAlign: "center",
  },
  container: {
    flex: 1,
    height: 200,
  },

  logLevel: {
    color: "#888",
    fontSize: 18,
    marginBottom: 5,
  },

  logList: {
    paddingBottom: 50,
  },
  message: {
    fontSize: 18,
    marginBottom: 5,
  },

  outerView: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    height: 80,
    paddingVertical: 8,
    padding: 8,
  },
});

export default ModalScreen;
