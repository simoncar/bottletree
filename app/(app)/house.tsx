import React from "react";
import { Image, Linking, StyleSheet, useColorScheme } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";

export default function House() {
  const colorScheme = useColorScheme();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>OTB Apps Builder</Text>
      <Text style={styles.textSub}>
        Where Every Step of Building Comes to Life
      </Text>

      <Image
        source={require("@/assets/images/shape.png")}
        style={styles.image}
      />
      <Text
        style={styles.link}
        onPress={() => {
          Linking.openURL("https://otbapps.com");
        }}>
        Visit our website
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
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8, // Optional: Adds rounded corners
  },
});
