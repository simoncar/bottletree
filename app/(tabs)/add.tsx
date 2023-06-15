import { StyleSheet, Button, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { StoryEntity, StoryState } from "../../lib/interfaces";
import { Image } from "expo-image";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import { db, storage } from "../../lib/firebaseConfig";
import * as Crypto from "expo-crypto";

import { uploadBytes, uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";

export default function addPhoto() {
	this.state = {
		photo1: photo1 !== undefined ? photo1 : ""
	};

	const [image, setImage] = useState(null);
	const [progress, setProgress] = useState(0);

	var story: StoryEntity;

	story = {
		photo1:
			"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2FIMG_4067.jpg?alt=media&token=c51daaf5-93e9-4604-b39e-2b20687d8855&_gl=1*1lv6shw*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODEzMi4wLjAuMA.."
	};

	this.state = {
		photo1:
			photo1 !== undefined
				? photo1
				: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2FIMG_4067.jpg?alt=media&token=c51daaf5-93e9-4604-b39e-2b20687d8855&_gl=1*1lv6shw*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODEzMi4wLjAuMA.."
	};

	const { key, summary, description, photo1, visible, showIconChat, order, dateTimeStart, dateTimeEnd, date_start, time_start_pretty, time_end_pretty } = story;

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
			console.log("BBB");

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
					// Observe state change events such as progress, pause, and resume
					// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
					const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
					});
				}
			);
		}
	};

	return (
		<View style={styles.container}>
			<Button title="Pick an image from camera roll" onPress={pickImage} />
			<Text>{progress}</Text>
			<Text>{image}</Text>

			{image && <Image source={image} style={styles.storyPhoto} />}

			<TouchableOpacity style={styles.photoButton} onPress={this._pickImage}>
				<FontAwesome5 name="camera" size={325} />
			</TouchableOpacity>
		</View>
	);
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
