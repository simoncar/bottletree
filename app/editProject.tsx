import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Button, SafeAreaView, StyleSheet } from "react-native";
import { TextInput } from "../components/Themed";
import ProjectContext from "../lib/context";

export default function editPost() {
	const { sharedData } = useContext(ProjectContext);
	const { projectTitle, projectId, icon } = useLocalSearchParams();
	const [text, onChangeText] = useState(projectTitle);

	const router = useRouter();

	useEffect(() => {
		<Stack.Screen options={{ title: "Overview" }} />;
	}, []);

	const saveDone = () => {
		router.push({
			pathname: "/",
			params: {
				project: sharedData.projectId,
				title: sharedData.projectTitle
			}
		});
	};

	const save = () => {
		updatePost(
			{
				projectId: sharedData.projectId,
				key: key,
				caption: text
			},
			saveDone
		);
	};

	return (
		<SafeAreaView>
			<Stack.Screen
				options={{
					headerRight: () => <Button title="Done" onPress={() => save()} />
				}}
			/>

			{icon && <Image source={icon} style={styles.storyPhoto} />}
			<TextInput style={styles.input} onChangeText={(text) => onChangeText(text)} placeholder={"Project Title"} value={text} autoFocus multiline />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	storyPhoto: {
		alignSelf: "center",
		borderColor: "lightgray",
		height: 300,
		marginBottom: 12,
		marginTop: 12,
		width: "98%"
	},
	input: {
		height: 140,
		margin: 12,
		padding: 10,
		paddingLeft: 20,
		width: "98%",
		fontSize: 20
	}
});
