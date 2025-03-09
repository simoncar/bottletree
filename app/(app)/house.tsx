import React from "react";
import {
  Image,
  Linking,
  StyleSheet,
  useColorScheme,
  Platform,
  Pressable,
} from "react-native";
import { Logo, Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import QRCode from "react-native-qrcode-svg";
import { About } from "@/lib/about";
import { useTranslation } from "react-i18next";

export default function House() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.topPanelCenter}>
        <Logo style={{ fontSize: 40 }}>One</Logo>
        <Text style={{ fontSize: 35 }}> </Text>
        <Logo style={{ fontSize: 40 }}>Build</Logo>
      </View>

      <View
        style={[
          styles.qrcodeContainer,
          { borderColor: Colors[colorScheme ?? "light"].text },
        ]}>
        <View style={styles.qrcode}>
          <QRCode size={200} ecl="L" value={`https://otbapps.com`} />
        </View>
      </View>
      <Text style={styles.textSub}>{t("shareTheAppWithYourFriends")}</Text>
      <View>
        <Pressable
          style={styles.button}
          onPress={() => Linking.openURL("https://otbapps.com")}>
          <Text style={styles.buttonText}>{t("findOutMore")}</Text>
        </Pressable>
      </View>

      <About />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 100,
  },
  topPanelCenter: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 30,
  },
  qrcode: {
    alignItems: "center",
    borderColor: "white",
    borderWidth: 2,
    width: 204,
    justifyContent: "center",
  },
  text: {
    fontSize: 34,
    marginBottom: 20,
    textAlign: "center",
    paddingBottom: 20,
  },
  link: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 20,
    color: Colors.light.tint,
    textAlign: "center",
  },
  textSub: {
    fontSize: 20,
    marginBottom: 20,
    padding: 20,
    textAlign: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8, // Optional: Adds rounded corners
  },
  button: {
    alignItems: "center",
    backgroundColor: "#9D5BD0",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    marginBottom: 10,
    width: 300,
    color: "white",
    textAlign: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
  },
  qrcodeContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 10,
    borderWidth: 10,
    backgroundColor: "white",
  },
});
