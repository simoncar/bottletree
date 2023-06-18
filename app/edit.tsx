import { StyleSheet } from "react-native";
import React, { useContext } from "react";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Text, View } from "../components/Themed";
import ProjectContext from "../lib/context";

export default function editPost() {
	const { sharedData } = useContext(ProjectContext);
	const { project, key, image } = useLocalSearchParams();
	const router = useRouter();

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

	return (
		<View style={styles.container}>
			<Text>Project: {project}</Text>
			<Text>Key: {key}</Text>
			<Text>Image: {image}</Text>
			{image && <Image source={image} style={styles.storyPhoto} />}
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
