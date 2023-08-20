import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import { ShortList } from "../components/sComponent";
import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import { getUsers } from "../lib/APIuser";
import { IUser } from "../lib/types";

const ModalScreen = (props) => {
  const { page } = useLocalSearchParams<{
    page: string;
  }>();

  const [users, setUsers] = useState<IUser[] | null>(null);
  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();

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

  function renderAdd() {
    return;
  }

  function renderRow(data: IUser) {
    return (
      <View key={data.key} style={styles.outerView}>
        <TouchableOpacity
          key={data.key}
          style={styles.innerView}
          onPress={() => {
            router.push({
              pathname: "/" + page,
              params: {
                projectId: data.key,
                title: data.title,
                icon: data.icon,
                archived: data.archived,
              },
            });
          }}>
          <View style={styles.avatar}>
            <Image style={styles.avatarFace} source={data.photoURL} />
          </View>
          <View>
            <Text style={styles.project}>{data.displayName || ""}</Text>
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
            <ShortList key={users.key} data={users} renderItem={renderRow} />
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

  project: {
    fontSize: 18,
    marginBottom: 5,
  },
  projectArchived: {
    color: "grey",
    fontSize: 18,
    marginBottom: 5,
  },
  projectList: {},

  rightChevron: {
    marginHorizontal: 8,
  },
});

export default ModalScreen;
