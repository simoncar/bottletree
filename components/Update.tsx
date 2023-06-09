import React, { useState } from "react";
import { View, Dimensions, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { db } from "../lib/firebaseConfig";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import Constants from "expo-constants";
const Update = (props) => {
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

	if (Constants.expoConfig?.ios?.buildNumber != version.toString()) {
		return (
			<View style={{ padding: 20 }}>
				<TouchableOpacity style={{ backgroundColor: "#E4E6C3", padding: 10, borderRadius: 100 }}>
					<Text style={styles.updateText}>Test Version {version}</Text>
				</TouchableOpacity>
			</View>
		);
	} else {
		return null;
	}
};

const styles = StyleSheet.create({
	updateText: {
		fontSize: 16,
		marginRight: 12,
		alignItems: "center",
		textAlign: "center",
		color: "black"
	}
});

export default Update;
