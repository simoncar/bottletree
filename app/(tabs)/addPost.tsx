import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Button, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { addPost } from "../../lib/APIpost";
import { addImage } from "../../lib/APIimage";
import ProjectContext from "../../lib/projectContext";
import { storage } from "../../lib/firebase";

import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

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
                </View>
            );
        } else {
            return;
        }
    };

    const renderButton = () => {
        if (null == image) {
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
    };

    const pickImage = async () => {
        console.log("pickImage: ");
        addImage(progressCallback, addImageCallback);
    };

    if (undefined === sharedData.projectId || "" === sharedData.projectId) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    Select a Project first and then try again
                </Text>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                {renderButton()}
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
