import { Stack, useLocalSearchParams } from "expo-router";
import React, { useContext, useState } from "react";
import { Button, SafeAreaView, StyleSheet, useColorScheme } from "react-native";
import { Text, View } from "../components/Themed";
import ProjectContext from "../lib/context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "../constants/Colors";

export default function editPost() {
	const { sharedData } = useContext(ProjectContext);
	const { project, key, image, caption } = useLocalSearchParams();
	const [text, onChangeText] = useState(caption);
	const router = useRouter();
	const colorScheme = useColorScheme();

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
			<View style={styles.avatarAContainer}>
				<View style={styles.avatarBView}>
					<Image
						style={styles.avatarCFace}
						source={"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface12.jpeg?alt=media&token=c048eee1-3673-4d5a-b35a-0e3c45a25c69"}
					/>
				</View>

				<View style={styles.nameContainer}>
					<Text style={styles.name}>Jacob Graham</Text>
				</View>
			</View>

			<View style={styles.outerView}>
				<View style={styles.leftContent}>
					<FontAwesome5 name="address-card" size={25} color={Colors[colorScheme ?? "light"].text} />
					<Text style={styles.settingName}>Contact Details</Text>
				</View>
				<View style={styles.rightChevron}>
					<FontAwesome5 name="chevron-right" size={20} color={Colors[colorScheme ?? "light"].text} />
				</View>
			</View>

			<View style={styles.outerView}>
				<View style={styles.leftContent}>
					<FontAwesome5 name="trash-alt" size={25} color={Colors[colorScheme ?? "light"].text} />
					<Text style={styles.settingName}>Delete Account</Text>
				</View>
				<View style={styles.rightChevron}>
					<FontAwesome5 name="chevron-right" size={20} color={Colors[colorScheme ?? "light"].text} />
				</View>
			</View>

			<View style={styles.outerView}>
				<View style={styles.leftContent}>
					<MaterialIcons name="logout" size={25} color={Colors[colorScheme ?? "light"].text} />
					<Text style={styles.settingName}>Log Out</Text>
				</View>
				<View style={styles.rightChevron}></View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	avatarAContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 50
	},
	avatarBView: {},
	avatarCFace: { width: 100, height: 100, borderRadius: 100 / 2 },

	outerView: {
		borderBottomColor: "#CED0CE",
		borderBottomWidth: StyleSheet.hairlineWidth,
		flexDirection: "row",
		paddingVertical: 8,
		alignItems: "center",
		padding: 8,
		height: 80
	},
	nameContainer: {
		paddingBottom: 50,
		paddingTop: 20
	},
	leftContent: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		paddingHorizontal: 8
	},
	name: {
		fontSize: 20,
		fontWeight: "bold",
		paddingLeft: 20
	},

	settingName: {
		fontSize: 20,
		paddingLeft: 20
	},
	rightChevron: {
		marginHorizontal: 8
	}
});
