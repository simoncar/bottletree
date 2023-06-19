import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, TextInput, SafeAreaView, Button } from "react-native";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { Text, View } from "../components/Themed";
import ProjectContext from "../lib/context";
import { onChange } from "react-native-reanimated";

export default function editPost() {
	const { sharedData } = useContext(ProjectContext);
	const [text, onChangeText] = useState("Useless Text");
	const { project, key, image, caption } = useLocalSearchParams();
	const router = useRouter();

	useEffect(() => {
		<Stack.Screen options={{ title: "Overview" }} />;
	}, []);

	const save = () => {
		router.push({
			pathname: "/",
			params: {
				project: sharedData.projectId,
				title: sharedData.projectTitle
			}
		});
	};

	const renderCaption = () => {
		if (caption == "") {
			return "";
		} else {
			return caption;
		}
	};

	return (
		<SafeAreaView>
			<Stack.Screen
				options={{
					headerRight: () => <Button title="Done" onPress={() => save()} />
				}}
			/>

			{image && <Image source={image} style={styles.storyPhoto} />}
			<TextInput style={styles.input} onChangeText={onChangeText} placeholder={"Write a caption..."} value={renderCaption()} autoFocus multiline />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center"
	},
	title: {
		fontSize: 20
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
	},
	input: {
		height: 40,
		margin: 12,
		padding: 10,
		paddingLeft: 20,
		width: "98%",
		fontSize: 20
	}
});
