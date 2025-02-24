import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Pressable, useColorScheme } from "react-native";
import { View, Text } from "./Themed";
import { getProjectUsers } from "@/lib/APIproject";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ShortList } from "@/components/sComponent";
import { Image } from "expo-image";
import Colors from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { deleteProjectUser } from "@/lib/APIproject";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import Swipeable from "@/components/Swipeable";
import { UserContext } from "@/lib/UserContext";

export const ProjectUsers = (props: any) => {
  const { project, update } = useLocalSearchParams<{
    project: string;
    update: string;
  }>();

  const colorScheme = useColorScheme();
  const [projectUsers, setProjectUsers] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  let prevOpenedRow;
  const row: Array<any> = [];

  useEffect(() => {
    getProjectUsers(project, projectUsersRead);
  }, []);

  useEffect(() => {
    getProjectUsers(project, projectUsersRead);
  }, [update]);

  useEffect(() => {
    if (projectUsers !== "" && loading === true) {
      setLoading(false);
    }
  }, [projectUsers]);

  const projectUsersRead = (projectUsersDB) => {
    setProjectUsers(projectUsersDB);
  };

  const deleteDone = (id) => {
    getProjectUsers(project, projectUsersRead);
  };

  function renderHeader(data: any) {
    return (
      <Pressable
        style={styles.outerView}
        onPress={() => {
          router.navigate({
            pathname: "/userList",
            params: {
              project: project,
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
    if (data.uid === user?.uid) {
      me = " (Me)";
    }

    return (
      <Swipeable
        id={data.uid}
        key={data.uid}
        onDelete={() => {
          console.log("Swipeable delete");
          deleteProjectUser(project, data, deleteDone);
        }}>
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
            <View style={styles.skeletonSpace}></View>
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
          displayName: "Add People to Project",
          subTitle: "",
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
