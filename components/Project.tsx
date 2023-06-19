import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, Tabs } from "expo-router";
import { Image } from "expo-image";

const Project = (props) => {
	const { project, title, icon } = props;

	const clickItem = () => {
		onItemClicked(post);
	};

	return (
		<Link href="/projects" asChild>
			<Pressable>
				<View style={styles.outerView}>
					<View style={styles.avatar}>
						<Image style={styles.avatarFace} source={icon}></Image>
					</View>
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
	avatar: {
		textAlign: "center",
		marginRight: 12,
		width: 50,
		alignItems: "center"
	},
	avatarFace: { width: 48, height: 48, borderRadius: 48 / 2 },
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
