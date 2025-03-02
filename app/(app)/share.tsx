import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import React from "react";
import {
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Share,
} from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import QRCode from "react-native-qrcode-svg";
import { useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";

type ShareParams = {
  project: string;
  title: string;
};

const ShareLink = () => {
  const { project, title } = useLocalSearchParams<ShareParams>();
  const colorScheme = useColorScheme();
  const [copiedText, setCopiedText] = React.useState("");

  const CopyLinkButton = () => {
    return (
      <TouchableOpacity
        style={[
          styles.buttonStyle,
          { borderColor: Colors[colorScheme ?? "light"].text },
        ]}
        onPress={() => {
          Clipboard.setStringAsync("https://b.otbapps.com/" + project);
        }}>
        <FontAwesome6 name="copy" color="#999999" style={styles.avatarIcon} />
        <Text style={styles.shareButton}>Copy</Text>
      </TouchableOpacity>
    );
  };

  const ShareLinkButton = () => {
    return (
      <TouchableOpacity
        style={[
          styles.buttonStyle,
          { borderColor: Colors[colorScheme ?? "light"].text },
        ]}
        onPress={async () => {
          try {
            const result = await Share.share(
              {
                message: title + "\n\n" + "https://b.otbapps.com/" + project,
                url: "https://b.otbapps.com/" + project,
                title: "Share project",
              },
              {
                dialogTitle: "Share project",
                subject: title,
              },
            );
            if (result.action === Share.sharedAction) {
              if (result.activityType) {
                // shared with activity type of result.activityType
              } else {
                // shared
              }
            } else if (result.action === Share.dismissedAction) {
              // dismissed
            }
          } catch (error: any) {
            console.log("Share Error: ", error.message);
          }
        }}>
        <FontAwesome6 name="share" color="#999999" style={styles.avatarIcon} />
        <Text style={styles.shareButton}>Share</Text>
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
        <Text style={styles.shareText}>
          Let anybody with the link see this project
        </Text>
        <View style={styles.shareLink}>
          <Text style={styles.shareText}>https://b.otbapps.com/{project}</Text>
        </View>
        <CopyLinkButton />
        <ShareLinkButton />
      </View>

      <View style={styles.qrcode}>
        <QRCode size={200} ecl="L" value={`https://b.otbapps.com/${project}`} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarIcon: {
    fontSize: 20,
    paddingLeft: 5,
    paddingRight: 10,
  },
  buttonStyle: {
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 1,
    color: "#4267B2",
    flexDirection: "row",
    fontSize: 16,
    marginBottom: 20,
    marginTop: 10,
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
    borderColor: "white",
    borderWidth: 2,
    flexDirection: "row",
    width: 204,
  },
  shareButton: {
    fontSize: 20,
  },

  shareInstructions: {
    alignItems: "center",
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

export default ShareLink;
