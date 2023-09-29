import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Button,
} from "react-native";
import { Text, View, TextInput } from "../components/Themed";
import { useAuth, appSignIn } from "../lib/authProvider";
import { router, Stack } from "expo-router";
import { Image } from "expo-image";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "../constants/Colors";
import { updateAccountName, updateAccountPhotoURL } from "../lib/APIuser";
import { About } from "../lib/about";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { addImage } from "../lib/APIimage";
import { ScrollView } from "react-native-gesture-handler";

export default function editUser() {
  const { uid, photoURL, displayName } = useLocalSearchParams();

  const [text, onChangeText] = useState(displayName);
  const [textPhotoURL, onChangeTextPhotoURL] = useState(photoURL);
  const colorScheme = useColorScheme();
  const { sharedDataUser, updateSharedDataUser, signOut } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    if (null != sharedDataUser) {
      onChangeText(sharedDataUser.displayName);
    } else {
      onChangeText("");
    }
  }, []);

  const save = () => {
    console.log("save: " + sharedDataUser.displayName);

    updateAccountName(text);

    updateSharedDataUser({ displayName: text });
    router.push({
      pathname: "/",
    });
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

    onChangeTextPhotoURL(downloadURLarray[0]);
    updateAccountPhotoURL(downloadURLarray[0]); //firebease auth update function
    updateSharedDataUser({ photoURL: downloadURLarray[0] });
    
  };

  const pickImage = async () => {
    const multiple = false;
    addImage(multiple, progressCallback, completedCallback);
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
            onChangeTextPhotoURL("");

            break;
        }
      },
    );
  };

  const profilePic = () => {
    return (
      <View style={styles.profilePicContainer}>
        <TouchableOpacity
          onPress={() => {
            openActionSheet();
          }}>
          {textPhotoURL ? (
            <Image style={styles.profilePhoto} source={textPhotoURL} />
          ) : (
            <View style={styles.profileCircleIcon}>
              <Ionicons
                name="home"
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
          }}
        />
        <View style={styles.avatarAContainer}>
          <View style={styles.avatarBView}>{profilePic()}</View>

          <View style={styles.projectNameContainer}>
            <View style={styles.projectBox}>
              <TextInput
                style={styles.project}
                onChangeText={(text) => onChangeText(text)}
                placeholder={"Your Name"}
                value={text}
                multiline
              />
            </View>
          </View>
        </View>

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
          <TouchableOpacity key={"signOut"} onPress={() => signOut()}>
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

        <View style={styles.aboutContainer}>
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
    paddingTop: 50,
    paddingBottom: 50,
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
});
