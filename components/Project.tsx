import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
						<Image style={styles.projectAvatar} source={icon}></Image>
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

	rightChevron: {
		marginHorizontal: 8
	},
	avatar: {
		textAlign: "center",
		marginRight: 12,
		alignItems: "center"
	},

	projectAvatar: { width: 35, height: 35, borderRadius: 35 / 2 },
	innerView: {
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 8
	},
	outerView: {
		alignItems: "center",
		flexDirection: "row",
		backgroundColor: "#E4E6C3",
		borderRadius: 100
	}
});

export default Project;
function onItemClicked(post: any) {
	throw new Error("Function not implemented.");
}
