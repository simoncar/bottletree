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
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Toast from "react-native-root-toast";

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
              email: contact.emails?.[0]?.email.toLowerCase() || "",
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
    router.back({
      pathname: "/project/[project]",
      params: {
        update: id,
        project: project,
      },
    });
  };

  const handleUserSelection = (selectedUser: IUser) => {
    if (selectedUser.email) {
      addProjectUser(project, selectedUser, saveDone);
    } else {
      console.log("Selected user does not have an email address.");
      //   Toast.show("Contact must have an eamil address.", {
      //     duration: Toast.durations.SHORT,
      //   });
      alert(
        "Contact cannot be added unless they have an eamil address.  Instead try sharing the project with them using the share button.",
      );
    }
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
            handleUserSelection(data);
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
      <View style={styles.headerBox}>
        <View style={styles.innerView}>
          <View style={styles.avatar}>
            <FontAwesome
              name="search"
              color="#999999"
              style={styles.searchIcon}
            />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
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
  headerBox: {
    alignItems: "center",
    borderColor: "#999999",
    borderRadius: 100,
    borderWidth: 1,
    flexDirection: "row",
    height: 40,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  innerView: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 8,
  },

  searchIcon: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  searchInput: {
    fontSize: 18,
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
