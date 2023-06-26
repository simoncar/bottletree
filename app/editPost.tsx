import React, { useContext, useState, useEffect } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
    StyleSheet,
    SafeAreaView,
    Button,
    Alert,
    useColorScheme,
    TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { updatePost, deletePost } from "../lib/APIpost";
import ProjectContext from "../lib/projectContext";
import { TextInput, View, Text } from "../components/Themed";
import Colors from "../constants/Colors";

export default function editPost() {
    const { sharedData } = useContext(ProjectContext);
    const { project, key, image, caption } = useLocalSearchParams();
    const [text, onChangeText] = useState(caption);
    const colorScheme = useColorScheme();

    const router = useRouter();

    const saveDone = () => {
        router.push({
            pathname: "/",
            params: {
                project: sharedData.projectId,
                title: sharedData.projectTitle,
            },
        });
    };

    const save = () => {
        updatePost(
            {
                projectId: sharedData.projectId,
                key: key,
                caption: text,
            },
            saveDone,
        );
    };

    const onDelete = () => {
        Alert.alert(
            "Delete",
            "Are you sure?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: () => {
                        deletePost(
                            {
                                projectId: sharedData.projectId,
                                key: key,
                                caption: text,
                            },
                            saveDone,
                        );
                    },
                },
            ],
            { cancelable: false },
        );
    };

    const renderCaption = () => {
        if (undefined == caption || caption == "") {
            return "";
        } else {
            return caption;
        }
    };

    return (
        <SafeAreaView>
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <Button title="Done" onPress={() => save()} />
                    ),
                }}
            />
            {image && <Image source={image} style={styles.storyPhoto} />}
            <View style={styles.outerView}>
                <View style={styles.leftContent}></View>
                <TouchableOpacity onPress={onDelete}>
                    <View style={styles.rightChevron}>
                        <FontAwesome5
                            name="trash-alt"
                            size={25}
                            color={Colors[colorScheme ?? "light"].text}
                        />
                    </View>
                </TouchableOpacity>
            </View>
            <TextInput
                style={styles.input}
                onChangeText={(text) => onChangeText(text)}
                placeholder={"Write a caption..."}
                value={renderCaption()}
                autoFocus
                multiline
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    storyPhoto: {
        alignSelf: "center",
        borderColor: "lightgray",
        height: 300,
        marginBottom: 12,
        marginTop: 12,
        width: "98%",
    },
    input: {
        height: 140,
        margin: 12,
        padding: 10,
        paddingLeft: 20,
        width: "98%",
        fontSize: 20,
    },
    leftContent: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal: 8,
    },
    rightChevron: {
        marginHorizontal: 8,
    },

    outerView: {
        borderBottomColor: "#CED0CE",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        paddingVertical: 8,
        alignItems: "center",
        padding: 8,
    },
});
