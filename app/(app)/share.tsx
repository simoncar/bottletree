import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { StyleSheet, useColorScheme, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import QRCode from "react-native-qrcode-svg";
import { useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";

type ShareParams = {
  project: string;
};

const Share = () => {
  const { project } = useLocalSearchParams<ShareParams>();
  const colorScheme = useColorScheme();
  const [copiedText, setCopiedText] = React.useState("");

  const CopyLinkButton = () => {
    return (
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => {
          Clipboard.setStringAsync("https://b.otbapps.com/" + project);
        }}>
        <Text style={styles.shareButton}>Copy link</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}>
      <View style={styles.shareInstructions}>
        <Text style={styles.shareHeading}>Link sharing</Text>
        <Text style={styles.shareText}>
          Let anybody with the link see this project
        </Text>
        <View style={styles.shareLink}>
          <Text style={styles.shareText}>https://b.otbapps.com/{project}</Text>
          <AntDesign
            name="sharealt"
            size={30}
            color={Colors[colorScheme ?? "light"].text}
            style={{ paddingLeft: 15 }}
          />
        </View>
        <CopyLinkButton />
      </View>

      <View style={styles.qrcode}>
        <QRCode size={200} ecl="L" value={`https://b.otbapps.com/${project}`} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 1,
    color: "#4267B2",
    fontSize: 16,
    padding: 8,
    textAlign: "center",
    width: 150,
  },
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
  shareButton: {
    color: "#4267B2",
    fontSize: 20,
    fontWeight: "bold",
  },
  shareHeading: {
    fontSize: 24,
    paddingBottom: 10,
  },
  shareInstructions: {
    paddingBottom: 25,
    paddingTop: 25,
  },
  shareLink: {
    flexDirection: "row",
    paddingBottom: 25,
    paddingTop: 25,
  },
  shareText: {
    fontSize: 20,
  },
});

export default Share;
