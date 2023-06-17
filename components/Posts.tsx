import React, { useEffect, useState, useContext } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

import Post from "./Post";
import Project from "./Project";
import { getPosts } from "../lib/APIpost";

export const Posts = (props) => {
	const { project2, isGrid } = props;
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const { project, title } = useLocalSearchParams();

	const postsRead = (postsDB) => {
		//console.log("postsRead:", postsDB);
		setPosts(postsDB);
	};

	useEffect(() => {
		const unsubscribe = getPosts(project, postsRead);
		setLoading(false);
		return () => {
			unsubscribe;
		};
	}, []);

	useEffect(() => {
		const unsubscribe = getPosts(project, postsRead);
		setLoading(false);
		//}
	}, [project]);

	const renderItems = (item) => {
		const post = item.item;
		console.log("AAA renderItems:", post.key, post.images[0]);

		return <Post post={post} />;
	};

	const getKey = (item) => {
		console.log("getKey:", item.key);
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
		backgroundColor: "#000",
		flex: 1,
		width: "100%",
		paddingTop: 4,
		padding: 10
	}
});
