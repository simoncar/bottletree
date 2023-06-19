import React, { useEffect, useState, useContext } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ProjectContext from "../lib/context";
import Post from "./Post";
import Project from "./Project";
import { getPosts } from "../lib/APIpost";
import { IPost } from "../lib/types";

export const Posts = (props) => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const { sharedData, updateSharedData } = useContext(ProjectContext);
	var { project, title } = useLocalSearchParams();

	console.log("Posts project (from params):", project);
	if (undefined == project) {
		console.log("Reaload from storage: sharedData:", sharedData.projectId);

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

	const getKey = (item) => {
		return item.key;
	};

	return (
		<View style={styles.list}>
			<Project project={project} title={title} />
			<FlatList data={posts} renderItem={renderItems} keyExtractor={(item, index) => getKey(item)} />
		</View>
	);
};

const styles = StyleSheet.create({
	list: {
		flex: 1,
		width: "100%",
		paddingTop: 4,
		padding: 10
	}
});
