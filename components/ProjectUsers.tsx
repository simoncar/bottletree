import { ShortList } from "@/components/sComponent";
import Colors from "@/constants/Colors";
import { deleteProjectUser, getProjectUsers } from "@/lib/APIproject";
import { UserContext } from "@/lib/UserContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Text, View } from "./Themed";

export const ProjectUsers = (props: any) => {
  const { project, update } = useLocalSearchParams<{
    project: string;
    update: string;
  }>();

  const colorScheme = useColorScheme();
  const [projectUsers, setProjectUsers] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const { t } = useTranslation();

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
        }}
      >
        <View style={styles.avatar}>
          <AntDesign
            name="adduser"
            size={25}
            color={Colors[colorScheme ?? "light"].text}
          />
        </View>
        <View>
          <Text style={styles.name}>{data.displayName || ""}</Text>
        </View>
      </Pressable>
    );
  }

  function renderRow(data: any, index: number) {
    let me = "";
    if (data.uid === user?.uid) {
      me = " (Me)";
    }

    function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
      const styleAnimation = useAnimatedStyle(() => {
        return {
          transform: [{ translateX: drag.value + 80 }],
        };
      });

      return (
        <Reanimated.View style={styleAnimation}>
          <Pressable
            style={styles.rightDeleteBox}
            onPress={() => {
              deleteProjectUser(project, data, deleteDone);
              row[index].close();
            }}
          >
            <AntDesign name="delete" size={25} color={"white"} />
            <Text style={{ color: "white" }}>Delete</Text>
          </Pressable>
        </Reanimated.View>
      );
    }

    return (
      <Swipeable
        key={index}
        renderRightActions={RightAction}
        rightThreshold={40}
        friction={2}
        onSwipeableOpen={() => closeRow(index)}
        ref={(ref) => (row[index] = ref)}
      >
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
          displayName: t("addPeopleToProject"),
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
    fontSize: 18,
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
    height: 80,
    width: 80,
  },
  skeletonAvatarFace: {
    borderRadius: 48 / 2,
    height: 48,
    width: 48,
  },
  skeletonName: {
    borderRadius: 5,
    height: 48,
  },

  skeletonSpace: { padding: 10 },
});
