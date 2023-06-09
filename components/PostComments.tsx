import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, useColorScheme, Pressable } from "react-native";
import { View, Text, TextInput, ParsedText } from "./Themed";
import { addComment, getComments } from "../lib/APIpost";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "../constants/Colors";
import { IComment } from "../lib/types";
import { useAuth } from "../lib/authProvider";
import { Timestamp } from "firebase/firestore";

const Comments = (props) => {
    const { post, project } = props;

    const defaultComment = "Add a comment...";
    const [comments, setComments] = useState([]);
    const [text, setComment] = useState(defaultComment);
    const [action, setAction] = useState(false);
    const [saved, setSaved] = useState(false);
    const colorScheme = useColorScheme();
    const { sharedDataUser } = useAuth();

    useEffect(() => {
        getComments(project, post).then((comments) => {
            setComments(comments);
        });
    }, []);

    useEffect(() => {
        getComments(project, post).then((comments) => {
            setComments(comments);
        });
    }, [saved]);

    const saveDone = (comment: IComment) => {
        //setProjects(projectsDB);
        console.log("Comment saved", comment);
        setSaved(true);
        setComment(defaultComment);
    };

    const save = () => {
        setAction(false);
        const comment: IComment = {
            comment: text,
            displayName: sharedDataUser.displayName,
            timestamp: Timestamp.now(),
            uid: sharedDataUser.uid,
        };

        addComment(project, post, comment, saveDone);
    };

    const renderInput = () => {
        if (action) {
            return (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.commentInput}
                        placeholder={defaultComment}
                        onChangeText={(text) => {
                            setComment(text);
                            setAction(true);
                        }}
                        value={text}
                        autoFocus
                    />
                    <Pressable
                        style={styles.inputAction}
                        onPress={() => {
                            save();
                        }}>
                        <MaterialIcons
                            name="send"
                            size={25}
                            color={Colors[colorScheme ?? "light"].text}
                        />
                    </Pressable>
                </View>
            );
        } else {
            return (
                <View style={styles.inputContainerHidden}>
                    <Text
                        style={styles.commentInputPlaceholder}
                        onPress={() => {
                            setAction(true);
                            setComment(null);
                        }}>
                        {text}
                    </Text>
                    <View style={styles.inputAction}></View>
                </View>
            );
        }
    };

    return (
        <View style={styles.commentsOverall}>
            <FlatList
                data={comments}
                renderItem={({ item }) => (
                    <View style={styles.commentView}>
                        <Text selectable style={styles.commentUserName}>
                            {item.displayName}
                        </Text>
                        <ParsedText
                            selectable
                            style={styles.commentText}
                            text={item.comment}
                        />
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
    commentInputPlaceholder: {
        color: "lightgray",
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
    inputContainerHidden: {
        borderRadius: 10,
        flexDirection: "row",
        margin: 10,
    },
});

export default Comments;
