import { useLocalSearchParams } from "expo-router";
import React, { useState, useContext } from "react";
import {
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Button,
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
import { updateAccountName, updateAccountPhotoURL } from "@/lib/APIuser";
import { About } from "@/lib/about";
import { Update } from "@/lib/update";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { addImageFromCameraRoll } from "@/lib/APIimage";
import { ScrollView } from "react-native-gesture-handler";
import { demoData } from "@/lib/demoData";
import { StatusBar } from "expo-status-bar";
import { UserContext } from "@/lib/UserContext";

export default function editUser() {
  const local = useLocalSearchParams<{
    uid: string;
  }>();

  const { session, signOut } = useSession();
  const { user, setUser } = useContext(UserContext);
  const [progress, setProgress] = useState(0);

  const { showActionSheetWithOptions } = useActionSheet();
  const colorScheme = useColorScheme();

  const admins = ["simon@simon.co", "eddymitchell133@gmail.com"];

  const save = () => {
    updateAccountName(session, user.displayName);
    router.back();
  };

  const progressCallback = (progress: number) => {
    setProgress(progress);
  };

  const completedCallback = (sourceDownloadURLarray: any[]) => {
    let ratio = 0.66666;
    const downloadURLarray = sourceDownloadURLarray.map((element) => {
      const myArray = element.split("*");
      if (myArray[0] > ratio) {
        ratio = myArray[0];
      }

      return myArray[1]; // For example, creating a new array with each element doubled.
    });

    setUser({ ...user, photoURL: downloadURLarray[0] });
    updateAccountPhotoURL(downloadURLarray[0]);
    setProgress(0);
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
            setUser({ ...user, photoURL: "" });

            break;
        }
      },
    );
  };

  const profilePic = () => {
    //if user is null return nothing
    if (!user) {
      return;
    }
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
          headerRight: () => <Button title="Save" onPress={() => save()} />,
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
              placeholder={"Your Name"}
              value={user.displayName}
            />
          </View>
        </View>
      </View>
      <View style={styles.outerView}>
        <TouchableOpacity
          key={"signOut"}
          onPress={() => {
            signOut();
            setUser(null);
            router.replace("/signIn");
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
      <TouchableOpacity
        key={"deleteAccount"}
        onPress={() =>
          router.navigate({
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
      <StatusBar style="auto" />
      <View style={styles.aboutContainer}>
        <Update />
        <About />
      </View>
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
    fontWeight: "bold",
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
