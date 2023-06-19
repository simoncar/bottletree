import React, { useState, useEffect, useContext } from "react";
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ProjectContext from "../lib/context";
import { Platform, Pressable, StyleSheet, useColorScheme, TouchableOpacity } from "react-native";
import { db } from "../lib/firebase";
import { Image } from "expo-image";
import { collection, getDocs } from "firebase/firestore";
import { ShortList } from "../components/sComponent";
import { Text, View } from "../components/Themed";
import { getProjects } from "../lib/APIprojects";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Colors from "../constants/Colors";

export default function ModalScreen() {
	const [projects, setProjects] = useState("");
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const colorScheme = useColorScheme();
	const { updateSharedData } = useContext(ProjectContext);

	const projectsRead = (projectsDB) => {
		setProjects(projectsDB);
	};

	useEffect(() => {
		const unsubscribe = getProjects(projectsRead);
		return () => {
			unsubscribe;
		};
	}, []);

	useEffect(() => {
		if (projects !== "" && loading === true) {
			setLoading(false);
		}
	}, [projects]);

	function readProjects() {
		getDocs(collection(db, "projects")).then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
				console.log("Reading Projects: ", doc.id, " => ", doc.data());
			});
		});
	}

	function renderRow(data: any) {
		return (
			<TouchableOpacity
				key={data.key}
				onPress={() => {
					updateSharedData({
						projectId: data.key,
						projectTitle: data.title,
						projectIcon: data.icon
					});

					router.push({
						pathname: "/",
						params: {
							project: data.key,
							title: data.title,
							icon: encodeURIComponent(data.icon)
						}
					});
				}}>
				<View style={styles.outerView}>
					<View style={styles.avatar}>
						<Image style={styles.avatarFace} source={data.icon}></Image>
					</View>
					<View>
						<Text style={styles.project}>{data.title || ""}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	function renderAdd() {
		return (
			<TouchableOpacity
				key={"addProject"}
				onPress={() => {
					console.log("Add Project");

					router.replace({
						pathname: "/addProject",
						params: {
							project: "post.projectId"
						}
					});
				}}>
				<View style={styles.outerView}>
					<View style={styles.avatar}>
						<Pressable>{({ pressed }) => <FontAwesome5 name="plus" size={25} color={Colors[colorScheme ?? "light"].text} style={{ opacity: pressed ? 0.5 : 1 }} />}</Pressable>
					</View>
					<View>
						<Text style={styles.project}>Add Project</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.projectList}>
				{loading === false && (
					<View style={styles.card}>
						<ShortList data={projects} renderItem={renderRow} />
					</View>
				)}
				<View style={styles.card}>{renderAdd()}</View>
			</View>

			{/* Use a light status bar on iOS to account for the black space above the modal */}
			<StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%"
	},

	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 20
	},
	projectList: {
		alignContent: "flex-start"
	},

	project: {
		fontSize: 18,
		marginBottom: 5
	},
	projectId: {
		fontSize: 12,
		marginBottom: 5,
		color: "#777777"
	},
	avatar: {
		textAlign: "center",
		marginRight: 12,
		width: 50,
		alignItems: "center"
	},
	avatarFace: { width: 48, height: 48, borderRadius: 48 / 2 },
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%"
	},
	innerView: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 8
	},

	outerView: {
		borderBottomColor: "#CED0CE",
		flexDirection: "row",
		paddingVertical: 8,
		alignItems: "center",
		padding: 8,
		height: 80
	},
	outerViewLast: {
		alignItems: "center",
		borderBottomColor: "#CED0CE",
		flexDirection: "row",
		paddingVertical: 8
	},
	rightChevron: {
		marginHorizontal: 8
	},
	subtitle: {
		color: "#777777"
	}
});
