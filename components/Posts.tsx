import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { View, Text } from "../components/Themed";
import { getPosts } from "../lib/APIpost";
import ProjectContext from "../lib/projectContext";
import { IPost, IProject } from "../lib/types";
import Post from "./Post";
import Project from "./ProjectPanel";
import { router } from "expo-router";
import { useAuth } from "../lib/authProvider";

import { demoData } from "../lib/demoData";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

export const Posts = () => {
  const { sharedDataUser } = useAuth();
  const { sharedDataProject } = useContext(ProjectContext);
  let currentProject: IProject = sharedDataProject;
  const [posts, setPosts] = useState([]);

  if (null == sharedDataProject) {
    currentProject = {
      key: "",
      title: "",
      icon: "",
      archived: false,
    };
  }

  const postsRead = (postsDB) => {
    setPosts(postsDB);
  };

  useEffect(() => {
    demoData();

    if (sharedDataUser && undefined != currentProject) {
      const unsubscribe = getPosts(currentProject.key, postsRead);
      return () => {
        unsubscribe;
      };
    }
  }, []);

  useEffect(() => {
    if (sharedDataUser && undefined != currentProject?.key) {
      const unsubscribe = getPosts(currentProject.key, postsRead);

      return () => {
        unsubscribe;
      };
    }
  }, [currentProject, sharedDataUser]);

  const renderItems = (item) => {
    const post: IPost = item.item;

    return <Post post={post} />;
  };

  const renderEmpty = () => {
    if (undefined != currentProject?.key) {
      return (
        <View style={styles.loginBtn}>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/addPost",
              });
            }}>
            <Text style={styles.buttonText}>Add a post</Text>
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
          <Project
            project={currentProject.key}
            title={currentProject.title}
            icon={currentProject.icon}
            archived={currentProject.archived}
            page=""
          />
        </View>
        <View>
          <KeyboardAwareFlatList
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
