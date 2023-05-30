import React, { useEffect, useState, useContext } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Post from "./Post";
import { Image } from "expo-image";
const user = {
	id: "1",
	username: "johndoe"
};

const instagramPosts = [
	{
		id: 1,
		author: [
			{
				id: 1,
				username: "johndoe"
			}
		],
		username: "johndoe",
		imageUrl: "https://example.com/image1.jpg",
		localImage: "../assets/images/icon.png",
		caption: "Beautiful sunset at the beach! 🌅🏖️",
		likes: 1245,
		comments: [
			{
				username: "janedoe",
				comment: "Wow, amazing shot! 😍"
			},
			{
				username: "marysmith",
				comment: "I wish I could be there right now! 🌞"
			}
		],
		timestamp: "May 29, 2023"
	},
	{
		id: 2,
		author: [
			{
				id: 1,
				username: "johndoe"
			}
		],
		username: "janedoe",
		imageUrl: "https://example.com/image2.jpg",
		localImage: "../assets/imagesTemp/IMG_4072.jpg",
		caption: "Exploring the city streets. #urbanlife",
		likes: 876,
		comments: [
			{
				username: "johndoe",
				comment: "Love this cityscape! 🏙️"
			},
			{
				username: "marysmith",
				comment: "What a vibrant city! 🔥"
			}
		],
		timestamp: "May 30, 2023"
	}
];

const Posts = (props) => {
	const { authorId, postCategory, isGrid } = props;

	const [posts, setPosts] = useState();

	const navigation = useNavigation();

	useEffect(() => {
		loadPosts();
		console.log("Posts: useEffect");

		return () => {
			// setPosts([]);
			// const postsRef = databaseRef(database, "posts");
			// databaseOff(postsRef);
		};
	}, []);

	const loadPosts = () => {
		setPosts(instagramPosts);

		// const postsRef = databaseRef(database, "posts");
		// databaseOnValue(postsRef, async (snapshot) => {
		// 	const values = snapshot.val();
		// 	if (values) {
		// 		const keys = Object.keys(values);
		// 		const posts = keys.map((key) => values[key]);
		// 		const transformedPosts = await transformPosts(posts);
		// 		setPosts(() => transformedPosts);
		// 	} else {
		// 		setPosts(() => []);
		// 	}
		// });
	};

	const toggleLike = async (post) => {};
	const toggleFollow = async (post) => {};
	const onItemClicked = async (post) => {};

	const renderItems = (item) => {
		const post = item.item;
		if (isGrid) {
			return <ProfilePost post={post} onItemClicked={onItemClicked} />;
		}
		return <Post post={post} toggleLike={toggleLike} toggleFollow={toggleFollow} onItemClicked={onItemClicked} isFollowHidden={user && user.id === post.author.id} />;
	};

	const getKey = (item) => {
		return item.id;
	};

	return (
		<View style={styles.list}>
			<FlatList numColumns={isGrid ? 3 : 1} data={posts} renderItem={renderItems} keyExtractor={(item, index) => getKey(item)} />
		</View>
	);
};

const styles = StyleSheet.create({
	list: {
		backgroundColor: "#fff",
		flex: 1,
		width: "100%",
		paddingTop: 4
	}
});

export default Posts;
