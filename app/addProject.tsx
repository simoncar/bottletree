import React, { useState, useContext } from "react";
import { StyleSheet, Button, SafeAreaView } from "react-native";
import { Image } from "expo-image";
import { useRouter, Stack } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Text, View, TextInput } from "../components/Themed";
import ProjectContext from "../lib/context";
import { addProject } from "../lib/APIprojects";
import { IProject } from "../lib/types";

import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";

export default function addPhoto() {
    const { sharedData, updateSharedData } = useContext(ProjectContext);

    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [text, onChangeText] = useState("");

    var project: IProject = {
        key: "",
        title: "",
        icon: "",
    };

    const router = useRouter();

    const saveDone = (id) => {
        updateSharedData({
            projectId: id,
            projectTitle: project.title,
            projectIcon: project.icon,
        });

        console.log("added project: ", id);

        router.replace({
            pathname: "/",
            params: {
                project: id,
                title: project.title,
            },
        });
    };

    const renderProgress = (progress) => {
        if (progress > 0) {
            return <Text>Upload Progress : {progress}%</Text>;
        } else {
            return;
        }
    };

    const onSave = async () => {
        project.title = text;
        addProject(project, saveDone);
    };

    const pickImage = async () => {};

    return (
        <SafeAreaView>
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <Button title="Done" onPress={() => onSave()} />
                    ),
                }}
            />

            <TextInput
                style={styles.input}
                onChangeText={(text) => onChangeText(text)}
                placeholder={"Write Project Name..."}
                value={text}
                autoFocus
                multiline
            />
            <View style={styles.button}>
                <Button title="Save" onPress={onSave} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 140,
        margin: 12,
        padding: 10,
        paddingLeft: 20,
        width: "98%",
        fontSize: 20,
    },

    button: {
        borderWidth: 1,
        borderColor: "lightgray",
        backgroundColor: "#E4E6C3",
        padding: 10,
        borderRadius: 100,
    },
});
