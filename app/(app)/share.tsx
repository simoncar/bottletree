import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";

const Share = () => {
  const colorScheme = useColorScheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}>
      <View style={styles.shareLink}>
        <Text style={styles.shareText}>http://otbapps.com/W84FCL</Text>
      </View>
      <View style={styles.qrcode}>
        <FontAwesome5
          name="qrcode"
          size={255}
          color={Colors[colorScheme ?? "light"].text}
        />
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
    textAlign: "center",
  },
  shareLink: {
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 25,
    textAlign: "center",
  },
  shareText: {
    fontSize: 20,
  },
});

export default Share;
