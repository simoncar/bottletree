import { Link, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { db } from "../lib/firebaseConfig";
import { QuerySnapshot, collection, getDocs } from "firebase/firestore";
import { ShortList } from "../components/sComponent";

import { Text, View } from "../components/Themed";
import { getProjects } from "../lib/APIprojects";

export default function ModalScreen() {
	const [projectsList, setProjectsList] = useState([]);
	const [projects, setProjects] = useState("");
	const [loading, setLoading] = useState(true);

	const navigation = useNavigation();
	const isPresented = navigation.canGoBack();

	const projectsRead = (projectsDB) => {
		//domainsSetter(JSON.stringify(projectsDB));
		setProjects(projectsDB);
		console.log("Callback projectsRead", projectsDB);
	};

	useEffect(() => {
		const unsubscribe = getProjects(projectsRead);
		console.log("useEffect: Getting Projects");

		return () => {
			unsubscribe;
		};
	}, []);

	useEffect(() => {
		if (projects !== "" && loading === true) {
			//setProjectsList(JSON.parse(projects));
			setLoading(false);
			console.log("Loading Set to FaLSe");
			console.log("useEffect [projects]");
		}
	}, [projects]);

	function readProjects() {
		//const querySnapshot =

		getDocs(collection(db, "projects")).then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
				console.log("Reading Projects: ", doc.id, " => ", doc.data());
			});
		});
	}

	function renderRow(title: string) {
		return (
			<TouchableOpacity>
				<View style={styles.outerView}>
					<Text style={styles.project}>{title || ""}</Text>
				</View>
			</TouchableOpacity>
		);
	}

	readProjects();

	return (
		<View style={styles.container}>
			<View style={styles.projectList}>
				{loading === false && (
					<View style={styles.card}>
						<ShortList data={projects} renderItem={renderRow} />
					</View>
				)}
			</View>

			<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

			<Link href="../">Ok</Link>

			{/* Use a light status bar on iOS to account for the black space above the modal */}
			<StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center"
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
		borderBottomWidth: StyleSheet.hairlineWidth,
		flexDirection: "row",
		paddingVertical: 8
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
