import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Share,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

type ShareLinkButtonProps = {
  project: string;
  title: string;
};

const ShareLinkButton: React.FC<ShareLinkButtonProps> = ({
  project,
  title,
}) => {
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
          const result = await Share.share(
            {
              message: title + "\n\n" + "https://b.otbapps.com/" + project,
              url: "https://b.otbapps.com/" + project,
              title: t("share"),
            },
            {
              dialogTitle: t("share"),
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
      <Text style={styles.shareButton}>{t("share")}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatarIcon: {
    fontSize: 20,
    marginRight: 8,
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
  shareButton: {
    fontSize: 20,
  },
});

export default ShareLinkButton;
