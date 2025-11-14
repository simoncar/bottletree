import React, { useState, useContext } from "react";
import {
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  View,
} from "react-native";
import Progress from "@/components/Progress";
import { Text, TextInput } from "@/components/Themed";
import { useSession } from "@/lib/ctx";
import { router, Stack, Redirect } from "expo-router";
import { Image } from "expo-image";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Colors from "@/constants/Colors";
import { registerForPushNotificationsAsync } from "@/lib/APINotification";
import {
  updateAccountName,
  updateAccountPhotoURL,
  updateUser,
} from "@/lib/APIuser";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { addImageFromCameraRoll } from "@/lib/APIimage";
import { ScrollView } from "react-native-gesture-handler";
import { demoData } from "@/lib/demoData";

import { UserContext } from "@/lib/UserContext";
import { useTranslation } from "react-i18next";

export default function EditUser() {
  const { session, signOut } = useSession();
  const { user, setUser } = useContext(UserContext);
  const [progress, setProgress] = useState(0);

  const { showActionSheetWithOptions } = useActionSheet();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const admins = ["simon@simon.co", "eddymitchell133@gmail.com"];

  const save = () => {
    console.log("save [uid]");

    updateAccountName(session, user.displayName);
    router.back();
  };

  const progressCallback = (progress: number) => {
    setProgress(progress);
  };

  const completedCallback = (sourceDownloadURLarray: any[]) => {
    //firstly check if the images are already parsed into an array with each element having a ratio and a URL.  if the ratio is not set, set it to 0.666
    sourceDownloadURLarray.forEach((element) => {
      if (!element.ratio) {
        element.ratio = 0.666;
      }
      return sourceDownloadURLarray;
    });

    setUser({ ...user, photoURL: sourceDownloadURLarray[0].url });
    updateAccountPhotoURL(sourceDownloadURLarray[0].url);
    setProgress(0);
  };

  const pickImage = async () => {
    const multiple = false;
    addImageFromCameraRoll(
      multiple,
      "profile",
      user.uid,
      progressCallback,
      completedCallback,
    );
  };

  const administration = async () => {
    router.navigate({
      pathname: "/projectListAdmin",
    });
  };

  const isAdmin = (email: string) => {
    if (admins.includes(email)) {
      return true;
    } else {
      return false;
    }
  };

  const toggleNotifications = () => {
    const turnNotificationOn =
      user.notifications !== undefined ? !user.notifications : true;

    setUser({ ...user, notifications: turnNotificationOn });
    updateUser({ ...user, notifications: turnNotificationOn });
    if (turnNotificationOn) {
      registerForPushNotificationsAsync()
        .then((token) => console.log("setting token:", token))
        .catch((error: any) => console.log("setting token error:", error));
    }
  };

  const openActionSheet = async () => {
    console.log("openActionSheet");

    const options = [t("pickFromCameraRoll"), t("delete"), t("cancel")];
    const destructiveButtonIndex = options.length - 2;
    const cancelButtonIndex = options.length - 1;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            break;
          case 1:
            updateAccountPhotoURL("");
            setUser({ ...user, photoURL: "" });

            break;
        }
      },
    );
  };

  const profilePic = () => {
    if (!user) {
      return;
    }
    return (
      <View style={styles.profilePicContainer}>
        <TouchableOpacity
          onPress={() => {
            openActionSheet();
          }}
        >
          {user.photoURL ? (
            <Image style={styles.profilePhoto} source={user.photoURL} />
          ) : (
            <View style={styles.profileCircleIcon}>
              <Ionicons
                name="person-outline"
                size={100}
                color="#999999"
                style={styles.profilePic}
              />
            </View>
          )}
          <View style={styles.circle}>
            <Entypo name="camera" size={17} style={styles.camera} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (!session) {
    return <Redirect href="/signIn" />;
  }
  if (!user) {
    return;
  }

  return (
    <ScrollView>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPressIn={() => {
                console.log("save , [uid], touchableOpacity");
                save();
              }}
            >
              <Text>{t("done")}</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Progress progress={progress} />
      <View style={styles.avatarAContainer}>
        <View style={styles.avatarBView}>{profilePic()}</View>

        <View style={styles.projectNameContainer}>
          <View style={styles.projectBox}>
            <TextInput
              style={styles.project}
              onChangeText={(text) => setUser({ ...user, displayName: text })}
              placeholder={t("yourName")}
              value={user.displayName}
            />
          </View>
        </View>
      </View>
      <View>
        <View style={styles.outerView}>
          <TouchableOpacity key={"admin"} onPress={() => toggleNotifications()}>
            <View style={styles.leftContent}>
              <MaterialIcons
                name={
                  user.notifications
                    ? "notifications-active"
                    : "notifications-off"
                }
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
              <Text style={styles.settingName}>
                {t("notifications")} {user.notifications ? t("on") : t("off")}
              </Text>
            </View>
            <View style={styles.rightChevron}></View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.outerView}>
        <TouchableOpacity
          key={"signOut"}
          onPress={() => {
            setUser(null);
            signOut();

            router.replace("/signIn");
          }}
        >
          <View style={styles.leftContent}>
            <MaterialIcons
              name="logout"
              size={25}
              color={Colors[colorScheme ?? "light"].text}
            />
            <Text style={styles.settingName}>{t("logOut")}</Text>
          </View>
          <View style={styles.rightChevron}></View>
        </TouchableOpacity>
      </View>
      {isAdmin(user?.email) && (
        <View>
          <View style={styles.outerView}>
            <TouchableOpacity key={"admin"} onPress={() => administration()}>
              <View style={styles.leftContent}>
                <MaterialCommunityIcons
                  name="shield-lock"
                  size={25}
                  color={Colors[colorScheme ?? "light"].text}
                />
                <Text style={styles.settingName}>
                  Administration (Eddie Mode)
                </Text>
              </View>
              <View style={styles.rightChevron}></View>
            </TouchableOpacity>
          </View>
          <View style={styles.outerView}>
            <TouchableOpacity key={"admin"} onPress={() => demoData()}>
              <View style={styles.leftContent}>
                <FontAwesome5
                  name="seedling"
                  size={25}
                  color={Colors[colorScheme ?? "light"].text}
                />
                <Text style={styles.settingName}>Seed Demo Data</Text>
              </View>
              <View style={styles.rightChevron}></View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.outerView}>
        <TouchableOpacity
          key={"language"}
          onPress={() => router.navigate("/language")}
        >
          <View style={styles.leftContent}>
            <MaterialCommunityIcons
              name="translate"
              size={25}
              color={Colors[colorScheme ?? "light"].text}
            />
            <Text style={styles.settingName}>{t("language")}</Text>
          </View>
          <View style={styles.rightChevron}></View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        key={"deleteAccount"}
        onPress={() =>
          router.navigate({
            pathname: "/deleteAccount",
          })
        }
      >
        <View style={styles.outerView}>
          <View style={styles.leftContent}>
            <FontAwesome5
              name="trash-alt"
              size={25}
              color={Colors[colorScheme ?? "light"].text}
            />
            <Text style={styles.settingName}>{t("deleteAccount")}</Text>
          </View>
          <View style={styles.rightChevron}>
            <FontAwesome5
              name="chevron-right"
              size={20}
              color={Colors[colorScheme ?? "light"].text}
            />
          </View>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  aboutContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 50,
    paddingTop: 50,
  },
  avatarAContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  avatarBView: {},
  camera: {
    color: "white",
    marginBottom: 2,
  },
  circle: {
    alignItems: "center",
    backgroundColor: "lightgrey",
    borderColor: "white",
    borderRadius: 30 / 2,
    borderWidth: 2,
    height: 30,
    justifyContent: "center",
    left: 115,
    position: "absolute",
    top: 115,
    width: 30,
  },
  leftContent: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 8,
  },
  outerView: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    height: 80,
    paddingVertical: 8,
    padding: 8,
  },

  profileCircleIcon: {
    alignItems: "center",
    borderColor: "lightgray",
    borderRadius: 150 / 2,
    borderWidth: 1,
    height: 150,
    justifyContent: "center",
    width: 150,
  },
  profilePhoto: {
    borderColor: "grey",
    borderRadius: 150 / 2,
    borderWidth: 1,
    height: 150,
    overflow: "hidden",
    width: 150,
  },
  profilePic: {},
  profilePicContainer: {
    alignItems: "center",
    paddingBottom: 15,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  project: {
    fontSize: 25,
    padding: 10,
    textAlign: "center",
  },
  projectBox: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    width: "85%",
  },
  projectNameContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    paddingTop: 20,
  },
  rightChevron: {
    marginHorizontal: 8,
  },

  settingName: {
    fontSize: 20,
    paddingLeft: 20,
  },
});
