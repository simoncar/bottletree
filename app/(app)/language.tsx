import React, { useContext } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { SettingsListItem } from "@/components/SettingsListItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { IUser } from "@/lib/types";
import { UserContext } from "@/lib/UserContext";

interface TProps {
  navigation: any;
}

export default function SelectLanguage(props: TProps) {
  let language = "en";
  const { user } = useContext(UserContext);
  const getStyle = (pass: string) => {
    if (language === pass) {
      return styles.imageStyleCheckOn;
    } else {
      return styles.imageStyleCheckOff;
    }
  };

  const changeLanguage = (newLanguage: string) => {
    //setLanguage(newLanguage);
    //I18n.locale = newLanguage;

    router.navigate({
      pathname: "/app/user",
    });
  };

  const loggedInUser: IUser = user;

  if (loggedInUser?.language !== undefined) {
    language = loggedInUser.language;
  }

  return (
    <SafeAreaView style={styles.adminContainer}>
      <View style={styles.card}>
        <SettingsListItem
          hasNavArrow={false}
          title="English"
          onPress={() => changeLanguage("en")}
          icon={<MaterialCommunityIcons name="check" style={getStyle("en")} />}
        />
        <SettingsListItem
          hasNavArrow={false}
          title="中文(简体)"
          onPress={() => changeLanguage("zh")}
          icon={<MaterialCommunityIcons name="check" style={getStyle("zh")} />}
        />
        <SettingsListItem
          hasNavArrow={false}
          title="日本語"
          onPress={() => changeLanguage("ja")}
          icon={<MaterialCommunityIcons name="check" style={getStyle("ja")} />}
        />
        <SettingsListItem
          hasNavArrow={false}
          title="Français"
          onPress={() => changeLanguage("fr")}
          icon={<MaterialCommunityIcons name="check" style={getStyle("fr")} />}
        />
        <SettingsListItem
          hasNavArrow={false}
          title="한국어"
          onPress={() => changeLanguage("ko")}
          icon={<MaterialCommunityIcons name="check" style={getStyle("ko")} />}
        />
        <SettingsListItem
          hasNavArrow={false}
          title="Español"
          onPress={() => changeLanguage("es")}
          icon={<MaterialCommunityIcons name="check" style={getStyle("es")} />}
        />
        <SettingsListItem
          hasNavArrow={false}
          title="Português"
          onPress={() => changeLanguage("pt")}
          icon={<MaterialCommunityIcons name="check" style={getStyle("pt")} />}
        />
        <SettingsListItem
          lastItem={true}
          hasNavArrow={false}
          title="bahasa Indonesia"
          onPress={() => changeLanguage("id")}
          icon={<MaterialCommunityIcons name="check" style={getStyle("id")} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  adminContainer: {
    alignItems: "center",
    flex: 1,
    marginTop: 10,
  },
  card: {
    alignSelf: "center",
    borderRadius: 15,
    marginBottom: 12,
    padding: 10,
    width: "95%",
  },
  imageStyleCheckOff: {
    alignSelf: "center",
    fontSize: 30,
    height: 30,
    marginLeft: 15,
    width: 30,
  },
  imageStyleCheckOn: {
    alignSelf: "center",
    color: "#007AFF",
    fontSize: 30,
    height: 30,
    marginLeft: 15,
    width: 30,
  },
});
