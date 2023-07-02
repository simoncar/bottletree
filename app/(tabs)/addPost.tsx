import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Button, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { addPost } from "../../lib/APIpost";
import { addImage } from "../../lib/APIimage";
import ProjectContext from "../../lib/projectContext";
import { IPost } from "../../lib/types";
import * as Progress from "react-native-progress";

export default function addPhoto() {
    const { sharedData } = useContext(ProjectContext);

    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

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

    const renderProgress = (progress: number) => {
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

    const renderButton = (progress: number) => {
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
    const progressCallback = (progress: number) => {
        setProgress(progress);
    };
    const addImageCallback = (downloadURL: string) => {
        setImage(null);

        const post: IPost = {
            key: "",
            caption: "",
            projectId: sharedData.projectId,
            images: [downloadURL],
        };

        addPost(post, saveDone);
        setProgress(0);
    };

    const pickImage = async () => {
        console.log("pickImage: ");
        addImage(progressCallback, addImageCallback);
    };

    if (undefined === sharedData.projectId || "" === sharedData.projectId) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    Select a Project first and then try again.
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
    button: {
        backgroundColor: "#E4E6C3",
        borderColor: "lightgray",
        borderRadius: 100,
        borderWidth: 1,
        padding: 10,
    },
    container: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
    progressContainer: {
        padding: 20,
    },

    storyPhoto: {
        alignSelf: "center",
        borderColor: "lightgray",
        height: 200,
        marginBottom: 12,
        width: "98%",
    },

    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
});
