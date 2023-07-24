import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { View, Button } from "../components/Themed";
import { getPosts } from "../lib/APIpost";
import ProjectContext from "../lib/projectContext";
import { IPost, IProject } from "../lib/types";
import Post from "./Post";
import Project from "./ProjectPanel";
import { router } from "expo-router";

export const Posts = () => {
    const { sharedDataProject } = useContext(ProjectContext);
    let currentProject: IProject = sharedDataProject;
    const [posts, setPosts] = useState([]);

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
            return () => {
                unsubscribe;
            };
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

    const renderFooter = () => {
        return <View style={styles.footer}></View>;
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
                    page=""
                />
            </View>
            <View>
                <FlatList
                    data={posts}
                    renderItem={renderItems}
                    keyExtractor={(item, index) => getKey(item)}
                    ListEmptyComponent={renderEmpty}
                    ListFooterComponent={renderFooter}
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
    footer: {
        paddingTop: 100,
    },

    list: {
        flex: 1,
        paddingTop: 4,
        padding: 10,
        width: "100%",
    },
});
