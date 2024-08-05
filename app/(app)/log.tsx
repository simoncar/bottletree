import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { ShortList } from "@/components/sComponent";
import { Text, View } from "@/components/Themed";
import { getLogs } from "@/lib/APIlog";
import { ILog } from "@/lib/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getRelativeTime } from "@/lib/util";

const LogScreen = () => {
  const [logs, setLogs] = useState<ILog[] | null>(null);
  const [loading, setLoading] = useState(true);

  const logsRead = (logsDB: ILog[]) => {
    setLogs(logsDB);
    setLoading(false);
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
          <Text style={styles.message}>{data.email || ""}</Text>
          <Text style={styles.messageSmall}>
            {data.loglevel || ""} {data.message || ""}
          </Text>
          <Text style={styles.messageSmall}>
            {getRelativeTime(data.timestamp?.toDate()?.getTime() ?? 0)}
          </Text>
          <Text style={styles.messageSmall}>{data.version || ""}</Text>
          <Text style={styles.messageSmall}>{data.device || ""}</Text>
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

  logList: {
    paddingBottom: 50,
  },
  message: {
    fontSize: 18,
    marginBottom: 5,
  },
  messageSmall: {
    color: "grey",
    fontSize: 14,
  },

  outerView: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    paddingVertical: 8,
    padding: 8,
  },
});

export default LogScreen;
