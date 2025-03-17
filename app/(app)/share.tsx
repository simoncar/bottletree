import ShareLinkButton from "@/components/ShareLinkButton"; // Import the new component
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import QRCode from "react-native-qrcode-svg";

type ShareParams = {
  project: string;
  title: string;
};

const ShareLink = () => {
  const { project, title } = useLocalSearchParams<ShareParams>();
  const colorScheme = useColorScheme();
  const [copiedText, setCopiedText] = React.useState("");
  const { t } = useTranslation();

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
        <Text style={styles.shareButton}>{t("copy")}</Text>
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
        <Text style={styles.instructions}>{t("shareDescription")}</Text>

        <View style={styles.buttonRow}>
          <CopyLinkButton />
          <ShareLinkButton project={project} title={title} />
        </View>
      </View>
      <View
        style={[
          styles.qrcodeContainer,
          { borderColor: Colors[colorScheme ?? "light"].text },
        ]}>
        <View style={styles.qrcode}>
          <QRCode
            size={200}
            ecl="L"
            value={`https://b.otbapps.com/${project}`}
          />
        </View>
      </View>
      <View style={styles.shareLink}>
        <Text style={styles.shareURL}>https://b.otbapps.com/{project}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  qrcodeContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 10,
    borderWidth: 10,
    backgroundColor: "white",
  },
  buttonStyle: {
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 1,
    color: "#4267B2",
    flexDirection: "row",
    fontSize: 16,
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 10,
    padding: 8,
    textAlign: "center",
    width: 170,
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
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
    paddingBottom: 25,
    paddingTop: 25,
  },
  shareLink: {
    flexDirection: "row",
    paddingBottom: 25,
    paddingTop: 25,
  },
  shareURL: {
    fontSize: 12,
  },
  instructions: {
    fontSize: 18,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 20,
  },
});

export default ShareLink;
