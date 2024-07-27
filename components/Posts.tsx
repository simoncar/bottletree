import React, { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { View } from "@/components/Themed";
import { getPosts } from "@/lib/APIpost";
import { updateUserProjectCount } from "@/lib/APIuser";
import { IPost } from "@/lib/types";
import Post from "./Post";
import ProjectPanel from "./ProjectPanel";
import { useSession } from "@/lib/ctx";
import { FlatList } from "react-native-gesture-handler";
import { UserContext } from "@/lib/UserContext";
import { About } from "@/lib/about";

type Props = {
  project: string;
};

export const Posts = ({ project }: Props) => {
  const { session } = useSession();
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  const postsRead = (postsDB) => {
    setPosts(postsDB);
  };

  useEffect(() => {
    const unsubscribe = getPosts(project, postsRead);
    updateUserProjectCount(session, project);
    return () => {
      unsubscribe;
    };
  }, [project]);

  const renderItems = (item) => {
    const post: IPost = item.item;

    return (
      <View>
        <Post post={post} />
      </View>
    );
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
            ListFooterComponent={renderFooter}
            keyboardShouldPersistTaps={"handled"}
          />
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
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
});
