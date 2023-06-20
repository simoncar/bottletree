import React from "react";
import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

export const UserAvatar = (props) => {
	const { userId, avatar } = props;
	const router = useRouter();

	return (
		<TouchableOpacity
			key={"editProfile"}
			onPress={() => {
				router.push({
					pathname: "/user",
					params: {
						project: "post.projectId"
					}
				});
			}}
		>
			<View style={styles.avatar}>
				<Image
					style={styles.avatarFace}
					source={"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface12.jpeg?alt=media&token=c048eee1-3673-4d5a-b35a-0e3c45a25c69"}
				></Image>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	avatarFace: { width: 35, height: 35, borderRadius: 35 / 2 },
	avatar: {
		textAlign: "center",
		marginRight: 12,
		width: 50,
		alignItems: "center"
	}
});
