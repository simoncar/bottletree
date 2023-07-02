import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Button, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { addPost } from "../../lib/APIpost";
import { addImage } from "../../lib/APIimage";
import ProjectContext from "../../lib/projectContext";
import * as Progress from "react-native-progress";

export default function addPhoto() {
    const { sharedData, updateSharedDataProject } = useContext(ProjectContext);

    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const router = useRouter();

    console.log("addPhoto: " + JSON.stringify(sharedData));

    const saveDone = (id) => {
        router.push({
            pathname: "/",
            params: {
                project: sharedData.projectId,
                title: sharedData.projectTitle,
            },
        });
    };

    const renderProgress = (progress) => {
        if (progress && progress > 0) {
            return (
                <View style={styles.progressContainer}>
                    <Text>Upload Progress : {progress}%</Text>
                    <Progress.Bar
                        progress={progress / 100}
                        width={200}
                        borderWidth={0}
                        unfilledColor="#E5E5E5"
                    />
                </View>
            );
        } else {
            return;
        }
    };

    const renderButton = (progress) => {
        if (null == image && progress == 0) {
            return (
                <View style={styles.button}>
                    <Button
                        title="Pick an image from camera roll"
                        onPress={pickImage}
                    />
                </View>
            );
        } else {
            return;
        }
    };
    const progressCallback = (progress) => {
        console.log("progressCallback: " + progress);

        setProgress(progress);
    };
    const addImageCallback = (downloadURL) => {
        setImage(null);
        addPost(
            {
                projectId: sharedData.projectId,
                author: "DDDD",
                images: [downloadURL],
            },
            saveDone,
        );
        setProgress(0);
    };

    const pickImage = async () => {
        console.log("pickImage: ");
        addImage(progressCallback, addImageCallback);
    };

    if (undefined === sharedData.projectId || "" === sharedData.projectId) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>``
                    Select a Project first and then try again
                </Text>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                {renderButton(progress)}
                {renderProgress(progress)}
                {image && <Image source={image} style={styles.storyPhoto} />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    progressContainer: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },

    storyPhoto: {
        alignSelf: "center",
        borderColor: "lightgray",
        height: 200,
        marginBottom: 12,
        width: "98%",
    },

    button: {
        borderWidth: 1,
        borderColor: "lightgray",
        backgroundColor: "#E4E6C3",
        padding: 10,
        borderRadius: 100,
    },
});
