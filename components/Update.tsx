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
	console.log("installed version : ", Constants.expoConfig?.ios?.buildNumber);

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
	if (Constants.expoConfig?.ios?.buildNumber != undefined) {
		var installed = parseInt(Constants.expoConfig?.ios?.buildNumber);
		if (parseInt(Constants.expoConfig?.ios?.buildNumber) != version) {
			return (
				<View style={{ padding: 20 }}>
					<TouchableOpacity style={{ backgroundColor: "#E4E6C3", padding: 10, borderRadius: 100 }}>
						<Text style={styles.updateText}>Check for App Updates</Text>
					</TouchableOpacity>
				</View>
			);
		} else {
			return (
				<View style={{ padding: 20 }}>
					<TouchableOpacity style={{ backgroundColor: "#E4E6C3", padding: 10, borderRadius: 100 }}>
						<Text style={styles.updateText}>Check for App Updates</Text>
					</TouchableOpacity>
				</View>
			);
		}
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
