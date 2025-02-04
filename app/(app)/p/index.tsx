import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, ScrollView, Pressable, Linking } from "react-native";
import { ShortList } from "@/components/sComponent";
import { Text, View } from "@/components/Themed";
import { getLogs } from "@/lib/APIlog";
import { IPost } from "@/lib/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getRelativeTime } from "@/lib/util";
import { getPosts } from "@/lib/APIpost";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { UserContext } from "@/lib/UserContext";
import { Link, router, usePathname } from "expo-router";
import { ImageManipulator } from "expo-image-manipulator";

const LogScreen = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const { user, setUser } = useContext(UserContext);

  const admins = ["simon@simon.co"];

  const isAdmin = (email: string) => {
    if (admins.includes(email)) {
      return true;
    } else {
      return false;
    }
  };

  const postsRead = (postsDB) => {
    setPosts(postsDB);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = getPosts("photos", postsRead);
    return () => {
      unsubscribe;
    };
  }, []);

  const profilePic = () => {
    return (
      <View style={styles.profilePicContainer}>
        <Image
          style={styles.profilePhoto}
          source={
            "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/project%2F202501%2F1152af2d-d660-4552-87cf-c19943c16a7f?alt=media&token=4389c7fe-9785-46e1-aac5-f8b78acf0efb"
          }
        />
      </View>
    );
  };

  function renderRow(data: IPost) {
    const backgroundColor = "transparent";

    return (
      <View key={data.key}>
        <Pressable
          onPress={() => {
            if (data.linkURL) {
              Linking.openURL(data.linkURL);
            }
          }}
          style={[styles.outerView, { backgroundColor: backgroundColor }]}>
          <View style={styles.textContainer}>
            <Text style={styles.message}>{data.caption || ""}</Text>

            {data.images && data.images.length > 0 && (
              <View style={styles.imageContainer}>
                {data.images.slice(0, 3).map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image.url }}
                    style={styles.image}
                  />
                ))}
              </View>
            )}
            <Text style={styles.messageSmall}>
              {getRelativeTime(data.timestamp?.toDate()?.getTime() ?? 0)}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView style={styles.logList}>
        <View style={styles.avatarAContainer}>
          <View style={styles.avatarBView}>{profilePic()}</View>
        </View>
        {loading === false && (
          <View>
            <ShortList data={posts} renderItem={renderRow} />
          </View>
        )}

        {isAdmin(user?.email) && (
          <View style={{ alignItems: "center", paddingTop: 100 }}>
            <Link href="/">
              <Text>Home</Text>
            </Link>
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
  image: {
    height: 100,
    width: 100,
    paddingRight: 5,
    marginRight: 5,
    borderRadius: 5,
  },

  imageContainer: {
    flexDirection: "row",
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

  logList: {
    paddingBottom: 50,
  },
  message: {
    fontSize: 18,
    marginBottom: 5,
  },
  messageSmall: {
    color: "grey",
    fontSize: 14,
    paddingTop: 5,
  },

  outerView: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    paddingVertical: 8,
    padding: 8,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  profilePicContainer: {
    alignItems: "center",
    paddingBottom: 50,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  profilePhoto: {
    borderColor: "grey",
    borderRadius: 8, // Changed from 150/2 to 8 for slightly rounded corners
    height: 150,
    overflow: "hidden",
    width: 150,
  },
  avatarAContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  avatarBView: {},
});

export default LogScreen;
