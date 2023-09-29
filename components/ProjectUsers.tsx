import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, useColorScheme, Button } from "react-native";
import { View, Text, ParsedText } from "./Themed";
import { getProjectUsers } from "../lib/APIproject";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuth } from "../lib/authProvider";
import { ShortList } from "../components/sComponent";
import { Image } from "expo-image";
import Colors from "../constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { deleteProjectUser } from "../lib/APIproject";

export const ProjectUsers = (props) => {
  const { project, updateUsers } = props;
  const colorScheme = useColorScheme();
  const [projectUsers, setProjectUsers] = useState("");
  const [loading, setLoading] = useState(true);

  let prevOpenedRow;
  const row: Array<any> = [];

  useEffect(() => {
    getProjectUsers(project, projectUsersRead);
    console.log(" use Effec1t: ");
  }, []);

  useEffect(() => {
    console.log(" use Effec2t: ");
    if (projectUsers !== "" && loading === true) {
      setLoading(false);
    }
  }, [projectUsers]);

  useEffect(() => {
    console.log(" use Effec2t:updateUsersupdateUsersupdateUsers ", project);
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
          closeRow(index);
        }}>
        <AntDesign
          name="delete"
          size={25}
          color={Colors[colorScheme ?? "light"].text}
        />
        <Text>Delete</Text>
      </Pressable>
    );
  };

  function renderRow(data: any, index: number) {
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
              <Image style={styles.avatarFace} source={data.photoURL} />
            </View>
            <View>
              <Text style={styles.name}>{data.displayName || ""}</Text>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  }

  const closeRow = (index) => {
    console.log("closeRow:", index);

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
          subTitle: "Who can see this project",
        })}
      </View>
      <View>
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
});
