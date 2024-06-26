import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "@/components/Themed";
import { getPosts } from "@/lib/APIpost";
import { updateUserProjectCount } from "@/lib/APIuser";
import ProjectContext from "@/lib/projectContext";
import { IPost, IProject } from "@/lib/types";
import Post from "./Post";
import Project from "./ProjectPanel";
import { router } from "expo-router";
import { useAuth } from "@/lib/authProvider";
import { FlatList } from "react-native-gesture-handler";

type Props = {
  project: string;
};

export const Posts = ({ project }: Props) => {
  const { sharedDataUser } = useAuth();

  const [posts, setPosts] = useState([]);

  let currentProject: IProject;

  const postsRead = (postsDB) => {
    setPosts(postsDB);
  };

  useEffect(() => {
    if (sharedDataUser) {
      console.log("Posts useEffect calling getPosts : ", project);

      const unsubscribe = getPosts(project, postsRead);
      updateUserProjectCount(project);
      return () => {
        unsubscribe;
      };
    }
  }, [project, sharedDataUser]);

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
    return <View style={styles.footer}></View>;
  };
  const getKey = (item) => {
    return item.key;
  };

  if (null == sharedDataUser) {
    return;
  } else
    return (
      <View style={styles.list}>
        <View>
          <Project project={project} />
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
