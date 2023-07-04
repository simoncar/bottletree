import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, useColorScheme } from "react-native";
import { View, Text, TextInput } from "./Themed";
import { getComments } from "../lib/APIpost";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "../constants/Colors";

const Comments = (props) => {
    const { post, project } = props;
    const [comments, setComments] = useState([]);
    const [text, setComment] = useState("");
    const [action, setAction] = useState(false);
    const colorScheme = useColorScheme();

    useEffect(() => {
        getComments(project, post).then((comments) => {
            setComments(comments);
        });
    }, []);

    const renderInput = () => {
        return (
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.commentInput}
                    placeholder={"Add a comment..."}
                    onChangeText={(text) => {
                        setComment(text);
                        setAction(true);
                    }}
                    value={text}
                />
                <View style={styles.inputAction}>
                    <MaterialIcons
                        name="send"
                        size={25}
                        color={Colors[colorScheme ?? "light"].text}
                    />
                </View>
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
    commentInput: {
        flex: 1,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingTop: 10,
    },
    commentText: {},
    commentUserName: { fontWeight: "bold", paddingRight: 4 },
    commentView: { flexDirection: "row", paddingLeft: 10, paddingTop: 10 },
    commentsOverall: {},
    inputAction: { marginHorizontal: 8, paddingTop: 5 },
    inputContainer: {
        borderColor: "lightgray",
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: "row",
        margin: 10,
    },
});

export default Comments;
