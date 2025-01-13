import React from "react";
import {
  Image,
  Linking,
  StyleSheet,
  useColorScheme,
  Platform,
} from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import QRCode from "react-native-qrcode-svg";

export default function House() {
  const colorScheme = useColorScheme();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>One Build</Text>
      <Text style={styles.textSub}>
        Where Every Step of Building Comes to Life
      </Text>

      {Platform.OS === "ios" && (
        <>
          <View style={styles.qrcode}>
            <QRCode
              size={200}
              ecl="L"
              value={`https://apps.apple.com/app/id6449942716`}
            />
          </View>
          <Text style={styles.textSub}>Share the app with your friends</Text>
        </>
      )}
      <Text
        style={styles.link}
        onPress={() => Linking.openURL("https://otbapps.com")}>
        Visit otbapps.com
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  qrcode: {
    alignItems: "center",
    borderColor: "white",
    borderWidth: 2,
    flexDirection: "row",
    width: 204,
  },
  text: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
});
