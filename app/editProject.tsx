import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Button, SafeAreaView, StyleSheet } from "react-native";
import { ShortList } from "../components/sComponent";
import { Text, TextInput, View } from "../components/Themed";
import { getProjectUsers } from "../lib/APIprojects";
import ProjectContext from "../lib/context";

export default function editPost() {
	const { sharedData } = useContext(ProjectContext);
	const { projectId, projectTitle, icon } = useLocalSearchParams();
	const [text, onChangeText] = useState(projectTitle);
	const [projectUsers, setProjectUsers] = useState("");
	const [loading, setLoading] = useState(true);

	console.log("editProject.tsx: projectId: " + projectId);

	const router = useRouter();

	const projectUsersRead = (projectUsersDB) => {
		setProjectUsers(projectUsersDB);
	};

	useEffect(() => {
		console.log("editProject.tsx: useEffect projectId: " + projectId);
		const unsubscribe = getProjectUsers(projectId, projectUsersRead);
		return () => {
			unsubscribe;
		};
	}, []);

	useEffect(() => {
		if (projectUsers !== "" && loading === true) {
			setLoading(false);
		}
	}, [projectUsers]);

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

	function renderRow(data: any) {
		return (
			<View style={styles.outerView}>
				<View style={styles.avatar}>
					<Image style={styles.avatarFace} source={data.avatar}></Image>
				</View>
				<View>
					<Text style={styles.project}>{data.name || ""}</Text>
				</View>
			</View>
		);
	}

	return (
		<SafeAreaView>
			<Stack.Screen
				options={{
					headerRight: () => <Button title="Done" onPress={() => save()} />
				}}
			/>
			{icon && <Image source={icon} style={styles.storyPhoto} />}
			<TextInput style={styles.input} onChangeText={(text) => onChangeText(text)} placeholder={"Project Title"} value={text} multiline />
			<View style={styles.container}>
				<View style={styles.projectList}>
					{loading === false && (
						<View>
							<ShortList data={projectUsers} renderItem={renderRow} />
						</View>
					)}
				</View>
			</View>
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
