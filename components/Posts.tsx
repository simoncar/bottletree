import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
    TouchableOpacity,
    FlatList,
    Pressable,
    StyleSheet,
    useColorScheme,
} from "react-native";
import { View } from "../components/Themed";
import Colors from "../constants/Colors";
import { getPosts } from "../lib/APIpost";
import ProjectContext from "../lib/projectContext";
import { IPost } from "../lib/types";
import Post from "./Post";
import Project from "./Project";
import { useRouter } from "expo-router";

export const Posts = (props) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { sharedData, updateSharedDataProject } = useContext(ProjectContext);
    const colorScheme = useColorScheme();
    const router = useRouter();

    var { project, title, icon } = useLocalSearchParams();

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
            setLoading(false);
            return () => {
                unsubscribe;
            };
        }
    }, []);

    useEffect(() => {
        if (undefined != project) {
            const unsubscribe = getPosts(project, postsRead);
            setLoading(false);
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
    list: {
        paddingTop: 4,
        padding: 10,
        flex: 1,
        width: "100%",
    },
    addPost: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 200,
    },

    outerView: {
        borderBottomColor: "#CED0CE",
        flexDirection: "row",
        paddingVertical: 8,
        alignItems: "center",
        padding: 8,
        height: 80,
    },
    avatar: {
        textAlign: "center",
        marginRight: 12,
        width: 50,
        alignItems: "center",
    },
});
