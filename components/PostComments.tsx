import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import { View, Text } from "./Themed";
import { getComments } from "../lib/APIpost";

const Comments = (props) => {
    const { post, project } = props;
    const [comments, setComments] = useState([]);

    useEffect(() => {
        getComments(project, post).then((comments) => {
            setComments(comments);
        });
    }, []);

    return (
        <View style={styles.commentsOverall}>
            <FlatList
                data={comments}
                renderItem={({ item }) => (
                    <View style={styles.commentView}>
                        <Text style={styles.commentUserName}>
                            {item.displayName}
                        </Text>
                        <Text style={styles.commentText}>{item.comment}</Text>
                    </View>
                )}
                ListFooterComponent={() => (
                    <View style={styles.commentView}>
                        <Text>Add a comment...</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    commentText: {},
    commentUserName: { fontWeight: "bold", paddingRight: 4 },
    commentView: { flexDirection: "row", paddingLeft: 10, paddingTop: 10 },
    commentsOverall: {},
});

export default Comments;
