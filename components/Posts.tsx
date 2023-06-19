import React, { useEffect, useState, useContext } from "react";
import { FlatList, StyleSheet, Pressable, useColorScheme } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ProjectContext from "../lib/context";
import Post from "./Post";
import Project from "./Project";
import { getPosts } from "../lib/APIpost";
import { IPost } from "../lib/types";
import { Text, View } from "../components/Themed";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Colors from "../constants/Colors";

export const Posts = (props) => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const { sharedData, updateSharedData } = useContext(ProjectContext);
	const colorScheme = useColorScheme();
	var { project, title } = useLocalSearchParams();

	if (undefined == project) {
		project = sharedData.projectId;
		title = sharedData.projectTitle;
	}

	const postsRead = (postsDB) => {
		setPosts(postsDB);
	};

	useEffect(() => {
		if (undefined != project) {
			const unsubscribe = getPosts(project, postsRead);
			setLoading(false);
			return () => {
				unsubscribe;
			};
		}
	}, []);

	useEffect(() => {
		if (undefined != project) {
			const unsubscribe = getPosts(project, postsRead);
			setLoading(false);
		}
	}, [project]);

	const renderItems = (item) => {
		const post: IPost = item.item;

		return <Post post={post} />;
	};

	const renderEmpty = () => {
		return (
			<View style={styles.addPost}>
				<View style={styles.outerView}>
					<View style={styles.avatar}>
						<Pressable>{({ pressed }) => <FontAwesome5 name="plus-square" size={25} color={Colors[colorScheme ?? "light"].text} style={{ opacity: pressed ? 0.5 : 1 }} />}</Pressable>
					</View>
					<View></View>
				</View>
			</View>
		);
	};

	const getKey = (item) => {
		return item.key;
	};

	return (
		<View style={styles.list}>
			<Project project={project} title={title} />
			<FlatList data={posts} renderItem={renderItems} keyExtractor={(item, index) => getKey(item)} ListEmptyComponent={renderEmpty} />
		</View>
	);
};

const styles = StyleSheet.create({
	list: {
		flex: 1,
		width: "100%",
		paddingTop: 4,
		padding: 10
	},
	addPost: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 200
	},
	outerView: {
		borderBottomColor: "#CED0CE",
		flexDirection: "row",
		paddingVertical: 8,
		alignItems: "center",
		padding: 8,
		height: 80
	},
	avatar: {
		textAlign: "center",
		marginRight: 12,
		width: 50,
		alignItems: "center"
	},
	project: {
		fontSize: 18,
		marginBottom: 5
	}
});
