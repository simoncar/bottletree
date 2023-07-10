import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { storage } from "./firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import * as Crypto from "expo-crypto";

export const addImage = async (progressCallback, addImageCallback) => {
    console.log("addImage API Called");

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
    });

    if (!result.canceled) {
        var fileToUpload = "";

        const convertedImage = await new ImageManipulator.manipulateAsync(
            result.assets[0].uri,
            [{ resize: { height: 1000 } }],
            {
                compress: 0,
            },
        );

        fileToUpload = convertedImage.uri;

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", fileToUpload, true);
            xhr.send(null);
        });

        const UUID = Crypto.randomUUID();
        const d = new Date();

        const fileName =
            "posts/" +
            d.getUTCFullYear() +
            ("0" + (d.getMonth() + 1)).slice(-2) +
            "/" +
            UUID;

        const storageRef = ref(storage, fileName);

        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const uploadProgress = Math.floor(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                );
                progressCallback(uploadProgress);
                //setProgress(uploadProgress);
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                }
            },
            (error) => {
                console.log("error file upload:", error);
            },
            () => {
                // Handle successful uploads on complete
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("File available at", downloadURL);
                    addImageCallback(downloadURL);
                    // return to the previeus screen
                });
            },
        );
    }
};
