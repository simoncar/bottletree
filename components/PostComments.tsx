import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, Pressable } from "react-native";
import { View, Text, TextInput } from "./Themed";
import { getComments } from "../lib/APIpost";

const Comments = (props) => {
    const { post, project } = props;
    const [comments, setComments] = useState([]);
    const [text, setComment] = useState("");

    useEffect(() => {
        getComments(project, post).then((comments) => {
            setComments(comments);
        });
    }, []);

    const renderInput = () => {
        return (
            <View>
                <TextInput
                    style={styles.commentInput}
                    placeholder={"Add a comment..."}
                    onChangeText={(text) => {
                        console.log("text", text);

                        setComment(text);
                    }}
                    value={text}
                />
            </View>
        );
    };

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
            />
            {renderInput()}
        </View>
    );
};

const styles = StyleSheet.create({
    commentInput: { flexDirection: "row", paddingTop: 10 },
    commentText: {},
    commentUserName: { fontWeight: "bold", paddingRight: 4 },
    commentView: { flexDirection: "row", paddingLeft: 10, paddingTop: 10 },
    commentsOverall: {},
});

export default Comments;
