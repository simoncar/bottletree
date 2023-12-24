import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Button,
} from "react-native";
import { Text, View, TextInput } from "../../components/Themed";
import { useAuth } from "../../lib/authProvider";
import { router, Stack, useNavigation } from "expo-router";
import { Image } from "expo-image";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Colors from "../../constants/Colors";
import {
  updateAccountName,
  updateAccountPhotoURL,
  getUser,
} from "../../lib/APIuser";
import { About } from "../../lib/about";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { addImageFromCameraRoll } from "../../lib/APIimage";
import { ScrollView } from "react-native-gesture-handler";
import { demoData } from "../../lib/demoData";
import { IUser } from "../../lib/types";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import { auth } from "../../lib/firebase";

export default function editUser() {
  const local = useLocalSearchParams<{
    uid: string;
  }>();

  const { sharedDataUser, updateSharedDataUser } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  //console.log("navigation data:",JSON.stringify(navigation.getState()));

  const {
    currentlyRunning,
    availableUpdate,
    isUpdateAvailable,
    isUpdatePending,
  } = Updates.useUpdates();

  const [user, setUser] = useState<IUser>({
    uid: "",
    displayName: "",
    email: "",
    photoURL: "",
  });

  const admins = [
    "simoncar@gmail.com",
    "simon@simon.co",
    "eddymitchell133@gmail.com",
  ];

  const showDownloadButton = isUpdateAvailable;

  // Show whether or not we are running embedded code or an update
  const runTypeMessage = currentlyRunning.isEmbeddedLaunch
    ? "Running code from Appp Store build"
    : "Check for updates";

  useEffect(() => {
    getUser(local?.uid || "", (user) => {
      if (user) {
        setUser(user);
        updateSharedDataUser(user);
      }
    });
  }, []);

  useEffect(() => {
    if (isUpdatePending) {
      // Update has successfully downloaded
      //runUpdate();
      console.log("Update has successfully downloaded");
    }
  }, [isUpdatePending]);

  const save = () => {
    console.log("save: " + user.displayName, sharedDataUser?.displayName);
    updateSharedDataUser({ displayName: user.displayName });
    updateAccountName(user.displayName);

    router.back();
  };

  const progressCallback = (progress) => {
    console.log("progressCallback: " + progress);
  };

  const completedCallback = (sourceDownloadURLarray) => {
    console.log("completedCallback:", sourceDownloadURLarray);

    let ratio = 0.66666;
    const downloadURLarray = sourceDownloadURLarray.map((element) => {
      const myArray = element.split("*");
      console.log("myArray: ", myArray);
      if (myArray[0] > ratio) {
        ratio = myArray[0];
      }

      return myArray[1]; // For example, creating a new array with each element doubled.
    });

    setUser({ ...user, photoURL: downloadURLarray[0] });
    updateAccountPhotoURL(downloadURLarray[0]); //firebease auth update function
    updateSharedDataUser({ photoURL: downloadURLarray[0] });
  };

  const pickImage = async () => {
    const multiple = false;
    addImageFromCameraRoll(
      multiple,
      "profile",
      progressCallback,
      completedCallback,
    );
  };

  const administration = async () => {
    router.push({
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

  const openActionSheet = async () => {
    const options = ["Pick from Camera Roll", "Delete", "Cancel"];
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
            updateSharedDataUser({ photoURL: "" });
            setUser({ ...user, photoURL: "" });

            break;
        }
      },
    );
  };

  async function fetchandRunUpdatesAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest update: ${error}`);
    }
  }

  const profilePic = () => {
    return (
      <View style={styles.profilePicContainer}>
        <TouchableOpacity
          onPress={() => {
            openActionSheet();
          }}>
          {user.photoURL ? (
            <Image style={styles.profilePhoto} source={user.photoURL} />
          ) : (
            <View style={styles.profileCircleIcon}>
              <Ionicons
                name="ios-person"
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

  return (
    <SafeAreaView>
      <ScrollView>
        <Stack.Screen
          options={{
            headerRight: () => <Button title="Done" onPress={() => save()} />,
            title: "",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <View style={styles.avatarAContainer}>
          <View style={styles.avatarBView}>{profilePic()}</View>

          <View style={styles.projectNameContainer}>
            <View style={styles.projectBox}>
              <TextInput
                style={styles.project}
                onChangeText={(text) => setUser({ ...user, displayName: text })}
                placeholder={"Your Name"}
                value={user.displayName}
                multiline
              />
            </View>
          </View>
        </View>
        <TouchableOpacity
          key={"language"}
          onPress={() =>
            router.push({
              pathname: "/language",
            })
          }>
          <View style={styles.outerView}>
            <View style={styles.leftContent}>
              <FontAwesome
                name="language"
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
              <Text style={styles.settingName}>Language</Text>
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
        <TouchableOpacity
          key={"deleteAccount"}
          onPress={() =>
            router.push({
              pathname: "/deleteAccount",
            })
          }>
          <View style={styles.outerView}>
            <View style={styles.leftContent}>
              <FontAwesome5
                name="trash-alt"
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
              <Text style={styles.settingName}>Delete Account</Text>
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
        <View style={styles.outerView}>
          <TouchableOpacity
            key={"signOut"}
            onPress={() => {
              auth()
                .signOut()
                .then(() => {
                  console.log("Sign-out successful.");
                })
                .catch((error) => {
                  console.log(error.message);
                });
            }}>
            <View style={styles.leftContent}>
              <MaterialIcons
                name="logout"
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
              <Text style={styles.settingName}>Log Out</Text>
            </View>
            <View style={styles.rightChevron}></View>
          </TouchableOpacity>
        </View>
        {isAdmin(sharedDataUser?.email) && (
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
            key={"admin"}
            onPress={() => Updates.checkForUpdateAsync()}>
            <View style={styles.leftContent}>
              <MaterialIcons
                name="system-update-alt"
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
              <Text style={styles.settingName}>{runTypeMessage}</Text>
              <Text></Text>
            </View>
            <View style={styles.rightChevron}></View>
          </TouchableOpacity>
        </View>
        {showDownloadButton ? (
          <View style={styles.outerView}>
            <TouchableOpacity key={"admin"} onPress={fetchandRunUpdatesAsync}>
              <View style={styles.leftContent}>
                <MaterialIcons
                  name="system-update-alt"
                  size={25}
                  color={Colors[colorScheme ?? "light"].text}
                />
                <Text style={styles.settingName}>Download and run update</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
        <StatusBar style="auto" />
        <View style={styles.aboutContainer}>
          <Text style={styles.version}>
            Update Pending: {isUpdatePending.toString()}
          </Text>
          <Text style={styles.version}>
            Update Available : {isUpdateAvailable.toString()}
          </Text>

          <About />
        </View>
      </ScrollView>
    </SafeAreaView>
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
    fontWeight: "bold",
  },
  projectBox: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    padding: 10,
    width: "85%",
  },
  projectNameContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 50,
    paddingTop: 20,
  },
  rightChevron: {
    marginHorizontal: 8,
  },

  settingName: {
    fontSize: 20,
    paddingLeft: 20,
  },
  version: {
    color: "grey",
    fontSize: 14,
  },
});