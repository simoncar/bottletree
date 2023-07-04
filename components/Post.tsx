import React from "react";
import { Dimensions, StyleSheet, Pressable, FlatList } from "react-native";
import { useRouter } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import { View, Text } from "../components/Themed";
import { blurhash } from "../constants/Colors";
const { width } = Dimensions.get("window");

const Post = (props) => {
    const { post } = props;
    const router = useRouter();

    const imageUrls = post.images && post.images.map((image) => image);

    let caption = "";

    if (post.caption != undefined) {
        caption = post.caption;
    }

    const renderPostComments = () => {
        if (post.comments != undefined) {
            const comments = post.comments.map((comment) => comment);
            console.log("Post: renderPostContent", comments);
            return (
                <View style={styles.commentsOverall}>
                    <FlatList
                        data={comments}
                        renderItem={({ item }) => (
                            <View style={styles.commentView}>
                                <Text style={styles.commentUserName}>
                                    {item.username}{" "}
                                </Text>
                                <Text style={styles.commentText}>
                                    {item.comment}
                                </Text>
                            </View>
                        )}
                    />
                </View>
            );
        }
    };

    return (
        <View>
            <View style={styles.listItemHeader}></View>

            <View style={styles.postView}>
                <Carousel
                    width={width}
                    panGestureHandlerProps={{
                        activeOffsetX: [-10, 10],
                    }}
                    height={width / 1.5}
                    data={imageUrls}
                    renderItem={({ index }) => (
                        <Pressable
                            onPress={() => {
                                router.push({
                                    pathname: "/editPost",
                                    params: {
                                        project: post.projectId,
                                        key: post.key,
                                        image: encodeURIComponent(
                                            imageUrls[index],
                                        ),
                                        caption: encodeURIComponent(caption),
                                    },
                                });
                            }}
                            style={({ pressed }) => [
                                {
                                    flex: 1,
                                    justifyContent: "center",
                                },
                            ]}>
                            <View style={styles.imageContainer}>
                                <Image
                                    style={styles.image}
                                    source={{
                                        uri: imageUrls[index],
                                    }}
                                    placeholder={blurhash}
                                />
                            </View>
                        </Pressable>
                    )}
                />
                <View style={styles.commentBlock}>
                    <Text style={styles.comment}>{caption}</Text>
                    <Text style={styles.commentTime}>
                        {new Date(post.timestamp.toDate()).toDateString()}
                    </Text>
                    {renderPostComments()}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    comment: {
        fontSize: 16,
    },
    commentBlock: {
        padding: 8,
    },
    commentTime: {
        color: "#999",
        fontSize: 12,
        paddingTop: 4,
    },
    image: {
        backgroundColor: "#0553",
        flex: 1,
        height: 300,
        width: "100%",
    },
    imageContainer: {
        flex: 1,
        justifyContent: "center",
    },
    listItemHeader: {
        alignItems: "center",
        flexDirection: "row",
        padding: 8,
    },
    postView: { flex: 1 },
});

export default Post;
