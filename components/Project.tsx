import React, { useState } from "react";
import { View, useColorScheme, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { db } from "../lib/firebaseConfig";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import Constants from "expo-constants";
import { Link, Tabs } from "expo-router";

const Project = (props) => {
	const { project, title } = props;
	const colorScheme = useColorScheme();
	let aaa = 1;
	const clickItem = () => {
		onItemClicked(post);
	};
	let [version, setVersion] = useState(0);

	const docRef = doc(db, "about", "version");
	getDoc(docRef)
		.then((docSnap) => {
			if (docSnap.exists()) {
				console.log("Document data:", docSnap.data());
				setVersion(docSnap.data().current);
			} else {
				// docSnap.data() will be undefined in this case
				console.log("No such document!");
			}
		})
		.catch((error) => {
			console.log("Error getting document:", error);
		});
	return (
		<Link href="/projects" asChild>
			<Pressable>
				<View style={styles.outerView}>
					<View style={styles.innerView}>
						<Text style={styles.updateText}>{title || "Select Project"}</Text>
					</View>
					<View style={styles.rightChevron}>
						<FontAwesome5 name="angle-down" size={25} />
					</View>
				</View>
			</Pressable>
		</Link>
	);
};

const styles = StyleSheet.create({
	updateText: {
		fontSize: 16,
		marginRight: 12
	},
	updateddddText: {
		fontSize: 16,
		marginRight: 12
	},
	rightChevron: {
		marginHorizontal: 8
	},
	ddddddcccfffddddd: {
		marginHorizontal: 8
	},
	ddddddcdddccfffddddd: {
		marginHorizontal: 8
	},
	innerView: {
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 8
	},
	outerView: {
		alignItems: "center",
		flexDirection: "row",
		paddingVertical: 8,
		backgroundColor: "#E4E6C3",
		padding: 10,
		borderRadius: 100
	}
});

export default Project;
function onItemClicked(post: any) {
	throw new Error("Function not implemented.");
}
