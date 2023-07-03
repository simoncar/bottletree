import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, useColorScheme } from "react-native";
import { View, Text, Button } from "../components/Themed";
import Colors from "../constants/Colors";
import { getPosts } from "../lib/APIpost";
import ProjectContext from "../lib/projectContext";
import { IPost, IProject } from "../lib/types";
import Post from "./Post";
import Project from "./Project";
import { useRouter } from "expo-router";

export const Posts = () => {
    const { sharedDataProject } = useContext(ProjectContext);
    let currentProject: IProject = sharedDataProject;
    const [posts, setPosts] = useState([]);
    const colorScheme = useColorScheme();
    const router = useRouter();

    if (null == sharedDataProject) {
        currentProject = {
            key: "",
            title: "",
            icon: "",
        };
    }

    const postsRead = (postsDB) => {
        setPosts(postsDB);
    };

    useEffect(() => {
        if (undefined != currentProject) {
            const unsubscribe = getPosts(currentProject.key, postsRead);
            return () => {
                unsubscribe;
            };
        }
    }, []);

    useEffect(() => {
        if (undefined != currentProject?.key) {
            const unsubscribe = getPosts(currentProject.key, postsRead);
        }
    }, [currentProject]);

    const renderItems = (item) => {
        const post: IPost = item.item;

        return <Post post={post} />;
    };

    const renderEmpty = () => {
        return (
            <View style={styles.addPost}>
                <Button
                    title="Add a new post"
                    onPress={() => {
                        router.push({
                            pathname: "/addPost",
                        });
                    }}
                />
            </View>
        );
    };

    const getKey = (item) => {
        return item.key;
    };

    return (
        <View style={styles.list}>
            <View>
                <Project
                    project={currentProject.key}
                    title={currentProject.title}
                    icon={currentProject.icon}
                />
            </View>
            <View style={styles.button}>
                <FlatList
                    data={posts}
                    renderItem={renderItems}
                    keyExtractor={(item, index) => getKey(item)}
                    ListEmptyComponent={renderEmpty}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    addPost: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        marginTop: 200,
    },

    list: {
        flex: 1,
        paddingTop: 4,
        padding: 10,
        width: "100%",
    },
});
