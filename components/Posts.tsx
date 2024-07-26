import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "@/components/Themed";
import { getPosts } from "@/lib/APIpost";
import { updateUserProjectCount } from "@/lib/APIuser";
import { IPost, IProject } from "@/lib/types";
import Post from "./Post";
import ProjectPanel from "./ProjectPanel";
import { router } from "expo-router";
import { useSession } from "@/lib/ctx";
import { FlatList } from "react-native-gesture-handler";
import { UserContext } from "@/lib/UserContext";
import { About } from "@/lib/about";

type Props = {
  project: string;
};

export const Posts = ({ project }: Props) => {
  const { session } = useSession();
  const [posts, setPosts] = useState([]);
  const { user } = useContext(UserContext);

  let currentProject: IProject;

  const postsRead = (postsDB) => {
    setPosts(postsDB);
  };

  useEffect(() => {
    if (user) {
      const unsubscribe = getPosts(project, postsRead);
      updateUserProjectCount(session, project);
      return () => {
        unsubscribe;
      };
    }
  }, [project, user]);

  function updateSharedDataUserProjectCount(
    obj: Record<string, number>,
    project: string,
    postCount: number,
  ) {
    if (obj.postCount != undefined) {
      obj.postCount[project] = postCount;
    }
  }

  const renderItems = (item) => {
    const post: IPost = item.item;

    return (
      <View>
        <Post post={post} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (undefined != currentProject?.key) {
      return (
        <View style={styles.loginBtn}>
          <TouchableOpacity
            onPress={() => {
              router.navigate({
                pathname: "/camera",
              });
            }}>
            <Text style={styles.buttonText}>ADD FIRST POST</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <About />
      </View>
    );
  };
  const getKey = (item) => {
    return item.key;
  };

  if (null == user) {
    return;
  } else
    return (
      <View style={styles.list}>
        <View>
          <ProjectPanel project={project} />
        </View>

        <View style={{ flex: 1, flexDirection: "row" }}>
          <FlatList
            data={posts}
            renderItem={renderItems}
            keyExtractor={(item, index) => getKey(item)}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            keyboardShouldPersistTaps={"handled"}
          />
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
  buttonText: {
    color: "white",
  },
  footer: {
    paddingBottom: 500,
    paddingTop: 100,
  },

  list: {
    flex: 1,
    paddingTop: 4,
    padding: 10,
    width: "100%",
  },
  loginBtn: {
    alignItems: "center",
    backgroundColor: "#2196F3",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    marginTop: 100,
    width: "100%",
  },
});
