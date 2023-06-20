import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Button, SafeAreaView, StyleSheet } from "react-native";
import { ShortList } from "../components/sComponent";
import { Text, TextInput, View } from "../components/Themed";
import { getProjectUsers, updateProject } from "../lib/APIprojects";
import ProjectContext from "../lib/context";
import { BorderlessButton } from "react-native-gesture-handler";

export default function editPost() {
	const { sharedData, updateSharedData } = useContext(ProjectContext);
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

	const saveDone = (id) => {
		console.log("editProject.tsx: saveDone: id: " + text);

		updateSharedData({
			projectId: id,
			projectTitle: text,
			projectIcon: icon
		});

		router.push({
			pathname: "/",
			params: {
				project: id,
				title: text,
				icon: encodeURIComponent(sharedData.projectIcon)
			}
		});
	};

	const save = () => {
		updateProject(
			{
				key: projectId,
				title: text,
				icon: icon
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
					<Text style={styles.name}>{data.name || ""}</Text>
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

			<View style={styles.avatarAContainer}>
				<View style={styles.avatarBView}>{icon && <Image source={icon} style={styles.avatarCFace} />}</View>
			</View>
			<View style={styles.projectNameContainer}>
				<View style={styles.projectBox}>
					<TextInput style={styles.project} onChangeText={(text) => onChangeText(text)} placeholder={"Project Title"} value={text} multiline />
				</View>
			</View>

			<View>
				<View>
					<Text style={styles.accessHeader}> Access List</Text>
				</View>
				<View>
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
	avatarAContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 20
	},
	avatarBView: {},
	avatarCFace: { width: 100, height: 100, borderRadius: 100 / 2 },
	projectNameContainer: {
		paddingBottom: 50,
		paddingTop: 20,
		alignItems: "center",
		justifyContent: "center"
	},
	projectBox: {
		padding: 10,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "#CED0CE",
		width: "85%",
		alignItems: "center",
		justifyContent: "center"
	},
	project: {
		fontSize: 25,
		fontWeight: "bold"
	},
	name: {
		fontSize: 20,
		paddingLeft: 20
	},
	accessHeader: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 5,
		marginTop: 5,
		flexDirection: "row"
	},
	outerView: {
		borderBottomColor: "#CED0CE",
		borderBottomWidth: StyleSheet.hairlineWidth,
		flexDirection: "row",
		paddingVertical: 8,
		alignItems: "center",
		padding: 8,
		height: 80
	},
	avatar: {},
	avatarFace: { width: 48, height: 48, borderRadius: 48 / 2 }
});
