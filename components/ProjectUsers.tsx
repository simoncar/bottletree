import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, useColorScheme, Button } from "react-native";
import { View, Text, ParsedText } from "./Themed";
import { getProjectUsers } from "@/lib/APIproject";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuth } from "@/lib/authProvider";
import { ShortList } from "@/components/sComponent";
import { Image } from "expo-image";
import Colors from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { deleteProjectUser } from "@/lib/APIproject";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  SkeletonContainer,
  GradientProps,
} from "react-native-dynamic-skeletons";

const Gradient = (props: GradientProps) => <LinearGradient {...props} />;

export const ProjectUsers = (props) => {
  const { project, updateUsers } = props;
  const colorScheme = useColorScheme();
  const [projectUsers, setProjectUsers] = useState("");
  const [loading, setLoading] = useState(true);
  const { sharedDataUser, isLoading } = useAuth();

  let prevOpenedRow;
  const row: Array<any> = [];

  if (null == sharedDataUser) {
    loggedInUser = {
      uid: "",
      displayName: "",
      email: "",
      photoURL: "",
    };
  }

  useEffect(() => {
    getProjectUsers(project, projectUsersRead);
  }, []);

  useEffect(() => {
    if (projectUsers !== "" && loading === true) {
      setLoading(false);
    }
  }, [projectUsers]);

  useEffect(() => {
    getProjectUsers(project, projectUsersRead);
  }, [updateUsers]);

  const projectUsersRead = (projectUsersDB) => {
    setProjectUsers(projectUsersDB);
  };

  const deleteDone = (id) => {
    console.log("deleteDone: ", id);
    getProjectUsers(project, projectUsersRead);
  };

  function renderHeader(data: any) {
    return (
      <Pressable
        style={styles.outerView}
        onPress={() => {
          router.push({
            pathname: "/userList",
            params: {
              project: "post.projectId",
            },
          });
        }}>
        <View style={styles.avatar}>
          <AntDesign
            name="adduser"
            size={25}
            color={Colors[colorScheme ?? "light"].text}
          />
        </View>
        <View>
          <Text style={styles.name}>{data.displayName || ""}</Text>
          <Text style={styles.nameSubtitle}>{data.subTitle || ""}</Text>
        </View>
      </Pressable>
    );
  }

  const renderRightActions = (progress, dragX, data, index) => {
    return (
      <Pressable
        style={styles.rightDeleteBox}
        onPress={() => {
          console.log("doDelete:", data, index);
          deleteProjectUser(project, data, deleteDone);
          row[index].close();
        }}>
        <AntDesign name="delete" size={25} color={"white"} />
        <Text style={{ color: "white" }}>Delete</Text>
      </Pressable>
    );
  };

  function renderRow(data: any, index: number) {
    let me = "";
    if (data.uid === sharedDataUser.uid) {
      me = " (Me)";
    }
    return (
      <Swipeable
        key={index}
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, data, index)
        }
        onSwipeableOpen={() => closeRow(index)}
        ref={(ref) => (row[index] = ref)}
        rightOpenValue={-100}>
        <View>
          <View key={data.uid} style={styles.outerView}>
            <View style={styles.avatar}>
              {data.photoURL ? (
                <Image style={styles.avatarFace} source={data.photoURL} />
              ) : (
                <View style={styles.avatarFace}>
                  <Ionicons
                    name="person-outline"
                    color="#999999"
                    style={styles.avatarIcon}
                  />
                </View>
              )}
            </View>

            <View>
              <Text style={styles.name}>
                {data.displayName || ""} {me}
              </Text>
              <Text style={styles.email}>{data.email || ""}</Text>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  }

  function renderSkeletonRow() {
    return (
      <View>
        <View>
          <View key="skeleton" style={styles.outerView}>
            <SkeletonContainer
              isLoading={true}
              Gradient={Gradient}
              colors={["#e1e1e1", "#f2f2f2", "#e1e1e1"]}
              style={{
                backgroundColor:
                  Colors[colorScheme ?? "light"].skeletonBackground,
              }}
              duration={2000}>
              <View style={styles.skeletonAvatarFace}></View>
            </SkeletonContainer>
            <View style={styles.skeletonSpace}></View>
            <SkeletonContainer
              isLoading={true}
              Gradient={Gradient}
              colors={["#e1e1e1", "#f2f2f2", "#e1e1e1"]}
              style={{
                backgroundColor:
                  Colors[colorScheme ?? "light"].skeletonBackground,
              }}
              duration={2000}>
              <View style={styles.skeletonName}></View>
            </SkeletonContainer>
          </View>
        </View>
      </View>
    );
  }

  const closeRow = (index) => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  return (
    <View>
      <View>
        {renderHeader({
          key: "header",
          displayName: "Project Access List",
          subTitle: "Add person to project",
        })}
      </View>

      <View>
        {loading === true && <View>{renderSkeletonRow()}</View>}
        {loading === false && (
          <View>
            <ShortList
              key={projectUsers.uid}
              data={projectUsers}
              renderItem={renderRow}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: { alignItems: "center", justifyContent: "center", width: 48 },
  avatarFace: { borderRadius: 48 / 2, height: 48, width: 48 },

  avatarIcon: {
    fontSize: 35,
    paddingTop: 5,
    textAlign: "center",
  },

  email: {
    color: "#888",
    fontSize: 20,
    paddingLeft: 20,
  },
  name: {
    fontSize: 20,
    paddingLeft: 20,
  },
  nameSubtitle: {
    color: "grey",
    fontSize: 16,
    paddingLeft: 20,
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
  rightDeleteBox: {
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    flexDirection: "column",
    justifyContent: "center",
    margin: 0,
    width: 70,
  },
  skeletonAvatarFace: {
    borderRadius: 48 / 2,
    height: 48,
    width: 48,
  },
  skeletonName: {
    borderRadius: 5,
    height: 48,
    width: 300,
  },

  skeletonSpace: { padding: 10 },
});
