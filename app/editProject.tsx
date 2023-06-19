import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Button, Alert } from "react-native";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { updateProject } from "../lib/APIProject";
import ProjectContext from "../lib/context";
import { TextInput, View } from "../components/Themed";

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

			{image && <Image source={icon} style={styles.storyPhoto} />}
			<TextInput style={styles.input} onChangeText={(text) => onChangeText(text)} placeholder={"Project Title"} value={text} autoFocus multiline />
			<View style={styles.actions}>
				<View style={styles.button}>
					<Button title="Delete" onPress={onDelete} />
				</View>
			</View>
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
	},
	button: {
		marginTop: 50,
		borderWidth: 1,
		borderColor: "lightgray",
		backgroundColor: "#E4E6C3",
		padding: 10,
		borderRadius: 100,
		alignSelf: "center",
		width: "30%"
	}
});
