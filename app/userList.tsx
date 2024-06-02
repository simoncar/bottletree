import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import { ShortList } from "@/components/sComponent";
import { Text, View } from "@/components/Themed";
import { getUsers } from "@/lib/APIuser";
import { addProjectUser } from "@/lib/APIproject";
import { IUser } from "@/lib/types";
import ProjectContext from "@/lib/projectContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/lib/authProvider";
import { useProject } from "@/lib/projectProvider";

const ModalScreen = (props) => {
  const { page } = useLocalSearchParams<{
    page: string;
  }>();

  const [users, setUsers] = useState<IUser[] | null>(null);
  const [loading, setLoading] = useState(true);
 const { sharedDataProject, updateStoreSharedDataProject } = useProject();
  const { sharedDataUser, isLoading } = useAuth();

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
    router.navigate({
      pathname: "/project/[project]",
      params: {
        pUpdateUsers: id,
        project: sharedDataProject.key,
      },
    });
  };

  function renderRow(data: IUser) {
    let backgroundColor = "transparent";
    if (data.uid === sharedDataUser.uid) {
      backgroundColor = "#3fc451";
    }
    return (
      <View
        key={data.uid}
        style={[styles.outerView, { backgroundColor: backgroundColor }]}>
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
      <ScrollView style={styles.userList}>
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

  userList: {
    paddingBottom: 50,
  },
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
