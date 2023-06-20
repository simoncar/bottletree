import { Stack, useLocalSearchParams } from "expo-router";
import React, { useContext, useState } from "react";
import { Button, SafeAreaView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import ProjectContext from "../lib/context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

export default function editPost() {
	const { sharedData } = useContext(ProjectContext);
	const { project, key, image, caption } = useLocalSearchParams();
	const [text, onChangeText] = useState(caption);
	const router = useRouter();

	const save = () => {
		router.push({
			pathname: "/",
			params: {
				project: "post.projectId"
			}
		});
	};

	return (
		<SafeAreaView>
			<View style={styles.container}>
				<View style={styles.avatar}>
					<Image
						style={styles.avatarFace}
						source={"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface12.jpeg?alt=media&token=c048eee1-3673-4d5a-b35a-0e3c45a25c69"}
					/>
				</View>

				<View style={styles.nameContainer}>
					<Text style={styles.name}>Jacob Graham</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	avatarFace: { width: 100, height: 100, borderRadius: 100 / 2 },
	avatar: {},
	container: {
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 50
	},
	name: {
		justifyContent: "center",
		paddingTop: 20,
		fontSize: 20,
		fontWeight: "bold"
	}
});
