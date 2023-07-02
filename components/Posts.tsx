import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, useColorScheme } from "react-native";
import { View } from "../components/Themed";
import Colors from "../constants/Colors";
import { getPosts } from "../lib/APIpost";
import ProjectContext from "../lib/projectContext";
import { IPost, IProject } from "../lib/types";
import Post from "./Post";
import Project from "./Project";
import { useRouter } from "expo-router";

export const Posts = () => {
    const { sharedData } = useContext(ProjectContext);
    const [posts, setPosts] = useState([]);
    const colorScheme = useColorScheme();
    const router = useRouter();
    let { project, title, icon } = useLocalSearchParams();

    if (undefined == project) {
        project = sharedData.projectId;
        title = sharedData.projectTitle;
        icon = sharedData.projectIcon;
    }

    const postsRead = (postsDB) => {
        setPosts(postsDB);
    };

    useEffect(() => {
        if (undefined != project) {
            const unsubscribe = getPosts(project, postsRead);
            return () => {
                unsubscribe;
            };
        }
    }, []);

    useEffect(() => {
        if (undefined != project) {
            const unsubscribe = getPosts(project, postsRead);
        }
    }, [project]);

    const renderItems = (item) => {
        const post: IPost = item.item;

        return <Post post={post} />;
    };

    const renderEmpty = () => {
        return (
            <View style={styles.addPost}>
                <View style={styles.outerView}>
                    <View style={styles.avatar}>
                        <Pressable
                            onPress={() => {
                                console.log("Prouter push: /addPost");

                                router.push({
                                    pathname: "/addPost",
                                    params: {
                                        project: "post.projectId",
                                    },
                                });
                            }}>
                            {({ pressed }) => (
                                <FontAwesome5
                                    name="plus-square"
                                    size={25}
                                    color={Colors[colorScheme ?? "light"].text}
                                    style={{ opacity: pressed ? 0.5 : 1 }}
                                />
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        );
    };

    const getKey = (item) => {
        return item.key;
    };

    return (
        <View style={styles.list}>
            <View>
                <Project project={project} title={title} icon={icon} />
            </View>
            <View>
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
    avatar: {
        alignItems: "center",
        marginRight: 12,
        textAlign: "center",
        width: 50,
    },

    list: {
        flex: 1,
        paddingTop: 4,
        padding: 10,
        width: "100%",
    },
    outerView: {
        alignItems: "center",
        borderBottomColor: "#CED0CE",
        flexDirection: "row",
        height: 80,
        paddingVertical: 8,
        padding: 8,
    },
});
