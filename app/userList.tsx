import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import { ShortList } from "../components/sComponent";
import { Text, View } from "../components/Themed";
import { getUsers } from "../lib/APIuser";
import { addProjectUser } from "../lib/APIproject";
import { IUser } from "../lib/types";
import ProjectContext from "../lib/projectContext";
import Ionicons from "@expo/vector-icons/Ionicons";

const ModalScreen = (props) => {
  const { page } = useLocalSearchParams<{
    page: string;
  }>();

  const [users, setUsers] = useState<IUser[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { sharedDataProject, updateSharedDataProject } =
    useContext(ProjectContext);

  const usersRead = (usersDB: IUser[]) => {
    setUsers(usersDB);
  };

  useEffect(() => {
    const unsubscribe = getUsers(usersRead);
    unsubscribe;
    return () => {
      // unsubscribe;
    };
  }, []);

  useEffect(() => {
    if (users !== null && loading === true) {
      setLoading(false);
    }
  }, [users]);

  const saveDone = (id) => {
    console.log("saveDone: ", id);
    router.push({
      pathname: "/editProject",
      params: {
        pUpdateUsers: id,
        projectId: sharedDataProject.key,
      },
    });
  };

  function renderRow(data: IUser) {
    return (
      <View key={data.uid} style={styles.outerView}>
        <TouchableOpacity
          style={styles.innerView}
          onPress={() => {
            addProjectUser(sharedDataProject.key, data, saveDone);
          }}>
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
            <Text style={styles.username}>{data.displayName || ""}</Text>
            <Text style={styles.userdata}>{data.email || ""}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.projectList}>
        {loading === false && (
          <View>
            <ShortList data={users} renderItem={renderRow} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    marginRight: 12,
    width: 50,
  },
  avatarFace: { borderRadius: 48 / 2, height: 48, width: 48 },

  avatarIcon: {
    fontSize: 35,
    paddingTop: 5,
    textAlign: "center",
  },
  container: {
    flex: 1,
    height: 200,
  },

  innerView: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",

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

  projectList: {},
  userdata: {
    color: "#888",
    fontSize: 18,
    marginBottom: 5,
  },

  username: {
    fontSize: 18,
    marginBottom: 5,
  },
});

export default ModalScreen;