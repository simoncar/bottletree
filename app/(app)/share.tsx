import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import QRCode from "react-native-qrcode-svg";
import { useLocalSearchParams } from "expo-router";

type ShareParams = {
  project: string;
};

const Share = () => {
  const { project } = useLocalSearchParams<ShareParams>();
  const colorScheme = useColorScheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}>
      <View style={styles.shareLink}>
        <Text style={styles.shareText}>https://b.otbapps.com/{project}</Text>
        <AntDesign
          name="sharealt"
          size={30}
          color={Colors[colorScheme ?? "light"].text}
          style={{ paddingLeft: 15 }}
        />
      </View>
      <View style={styles.qrcode}>
        <QRCode size={200} ecl="L" value={`https://b.otbapps.com/${project}`} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: 15,
    paddingHorizontal: 15,
    paddingTop: 25,
  },
  qrcode: {
    alignItems: "center",
    flexDirection: "row",
    height: 200,
    paddingTop: 100,
    width: 200,
  },
  shareLink: {
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 25,
    paddingTop: 100,
    textAlign: "center",
  },
  shareText: {
    fontSize: 20,
  },
});

export default Share;
