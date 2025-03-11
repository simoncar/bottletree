import React from "react";
import { TouchableOpacity, Share, Linking } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Text } from "@/components/Themed";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";
import { StyleSheet, useColorScheme } from "react-native";

type OpenFileButtonProps = {
  url: string;
};

const OpenFileButton: React.FC<OpenFileButtonProps> = ({ url }) => {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={[
        styles.buttonStyle,
        { borderColor: Colors[colorScheme ?? "light"].text },
      ]}
      onPress={async () => {
        try {
          console.log("Opening file: ", url);

          Linking.openURL(url).catch((err) =>
            console.error("Failed to open file URL:", err),
          );
        } catch (error: any) {
          console.log("File Open Error: ", error.message);
        }
      }}>
      <FontAwesome6 name="file" color="#999999" style={styles.avatarIcon} />
      <Text style={styles.shareButton}>{t("fileOpen")}</Text>
    </TouchableOpacity>
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
    width: 170,
  },
  shareButton: {
    fontSize: 20,
  },
});

export default OpenFileButton;
