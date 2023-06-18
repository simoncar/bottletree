import { StyleSheet, Button, TouchableOpacity } from "react-native";
import React, { useState, useContext } from "react";
import { StoryEntity, StoryState } from "../lib/interfaces";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Text, View } from "../components/Themed";
import { db, storage } from "../lib/firebaseConfig";
import * as Crypto from "expo-crypto";
import ProjectContext from "../lib/context";
import { savePost } from "../lib/APIpost";

import { uploadBytes, uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";

export default function editPost() {
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

	return <View style={styles.container}>{image && <Image source={image} style={styles.storyPhoto} />}</View>;
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
