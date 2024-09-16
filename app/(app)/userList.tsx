import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { ShortList } from "@/components/sComponent";
import { Text, View, TextInput } from "@/components/Themed";
import { addProjectUser } from "@/lib/APIproject";
import { IUser } from "@/lib/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { UserContext } from "@/lib/UserContext";
import * as Contacts from "expo-contacts";
import { sortContactsByName } from "@/lib/sort";
import Loading from "@/app/(app)/loading";

const UserList = () => {
  const { project } = useLocalSearchParams<{
    project: string;
  }>();

  const { user } = useContext(UserContext);
  const [users, setUsers] = useState<IUser[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const usersRead = (usersDB: IUser[]) => {
    setUsers(usersDB);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
        });

        sortContactsByName(data);

        if (data.length > 0) {
          const contacts = data.map((contact) => {
            console.log("contact: ", contact.phoneNumbers);

            return {
              key: contact.id,
              uid: contact.id,
              displayName: contact?.name || "",
              email: contact.emails?.[0]?.email || "",
              photoURL: null,
              project: project,
              anonymous: false,
            };
          });

          usersRead(contacts);
        }
      }
    })();
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
        update: id,
        project: project,
      },
    });
  };

  function renderRow(data: IUser) {
    let backgroundColor = "transparent";
    if (data.uid === user.uid) {
      backgroundColor = "#3fc451";
    }
    return (
      <View
        key={data.uid}
        style={[styles.outerView, { backgroundColor: backgroundColor }]}>
        <TouchableOpacity
          style={styles.innerView}
          onPress={() => {
            addProjectUser(project, data, saveDone);
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

  const filteredUsers = users?.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search ..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView style={styles.userList}>
        {loading === true && (
          <View>
            <Loading />
          </View>
        )}
        {loading === false && (
          <View>
            <ShortList data={filteredUsers} renderItem={renderRow} />
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
  searchBar: {
    borderColor: "gray",
    borderRadius: 5,
    borderWidth: 1,
    height: 40,
    margin: 10,
    paddingHorizontal: 8,
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

export default UserList;
