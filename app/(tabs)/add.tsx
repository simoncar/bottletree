import { StyleSheet, Button, TouchableOpacity } from "react-native";
import React, { useState, useContext } from "react";
import { StoryEntity, StoryState } from "../../lib/interfaces";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Text, View } from "../../components/Themed";
import { db, storage } from "../../lib/firebaseConfig";
import * as Crypto from "expo-crypto";
import ProjectContext from "../../lib/context";
import { savePost } from "../../lib/APIpost";

import { uploadBytes, uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";

export default function addPhoto() {
	const { sharedData, updateSharedData } = useContext(ProjectContext);

	const [image, setImage] = useState(null);
	const [progress, setProgress] = useState(0);

	const router = useRouter();
	var story: StoryEntity;

	const saveDone = (id) => {
		console.log("saveDone:", id);
		router.push({
			pathname: "/",
			params: {
				project: sharedData.projectId,
				title: sharedData.projectTitle
			}
		});
	};


	const renderProgress = (progress) => {
		if (progress > 0) {
			return <Text>Upload Progress : {progress}%</Text>;
		} else {
			return;
		}
	};

	const pickImage = async () => {
		var d = new Date();

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			quality: 1
		});

		if (!result.canceled) {
			var fileToUpload = "";
			var mime = "";

			const convertedImage = await new ImageManipulator.manipulateAsync(result.assets[0].uri, [{ resize: { height: 1000 } }], {
				compress: 0
			});

			fileToUpload = convertedImage.uri;
			setImage(fileToUpload);
			mime = "image/jpeg";

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

			const fileName = "posts/" + d.getUTCFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + UUID;

			const storageRef = ref(storage, fileName);

			const uploadTask = uploadBytesResumable(storageRef, blob);

			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const uploadProgress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
					console.log("Upload is " + uploadProgress + "% done");
					setProgress(uploadProgress);
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
					// Handle unsuccessful uploads
				},
				() => {
					// Handle successful uploads on complete
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						console.log("File available at", downloadURL);

						savePost(
							{
								projectId: sharedData.projectId,
								author: "DDDD",
								images: [downloadURL]
							},
							saveDone
						);

						// return to the previeus screen
					});
				}
			);
		}
	};

	if (undefined === sharedData.projectId || "" === sharedData.projectId) {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Select a Project first and then try again</Text>
			</View>
		);
	} else {
		return (
			<View style={styles.container}>
				<Button title="Pick an image from camera roll" onPress={pickImage} />
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
		justifyContent: "center"
	},
	title: {
		fontSize: 20,
		fontWeight: "bold"
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%"
	},
	storyPhoto: {
		alignSelf: "center",
		borderColor: "lightgray",
		height: 200,
		marginBottom: 12,
		width: "98%"
	}
});
