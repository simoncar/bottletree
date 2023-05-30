import React from "react";
import { View, Dimensions, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Image } from "expo-image";
import Carousel from "react-native-reanimated-carousel";

const blurhash = "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const { width } = Dimensions.get("window");

const Post = (props) => {
	const { post, toggleLike, toggleFollow, onItemClicked, isFollowHidden } = props;

	const onHeartClicked = () => {
		toggleLike(post);
	};

	const onFollowClicked = () => {
		toggleFollow(post);
	};

	const clickItem = () => {
		onItemClicked(post);
	};

	const renderPostContent = () => {
		const imageUrls = post.images.map((image) => image.imageUrl);
		console.log("Post: renderPostContent", imageUrls[2]);

		return (
			<View style={styles.listItemBody}>
				<Carousel
					loop
					width={width}
					data={[...new Array(1).keys()]}
					onSnapToItem={(index) => console.log("current index:", index)}
					renderItem={({ index }) => (
						<View
							style={{
								flex: 1,
								borderWidth: 0,
								justifyContent: "center"
							}}>
							<Image style={styles.image} source={imageUrls[index]}></Image>
						</View>
					)}
				/>
			</View>
		);
	};

	return (
		<View>
			<View style={styles.listItemHeader}>
				<View style={styles.listItemAuthorAvatarContainer}></View>
				<Text style={styles.listItemAuthorName}>{post.author.fullname}</Text>
				{!isFollowHidden && (
					<>
						<View style={styles.listItemDot}></View>
						<TouchableOpacity onPress={onFollowClicked}>
							<Text style={styles.listItemFollow}>{post.hasFollowed ? "Followed" : "Follow"}</Text>
						</TouchableOpacity>
					</>
				)}
			</View>
			{renderPostContent()}
			<View style={styles.listItemFooter}>
				<TouchableOpacity onPress={onHeartClicked}></TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	image: {
		flex: 1,
		width: "100%",
		backgroundColor: "#0553"
	},
	listItemHeader: {
		alignItems: "center",
		flexDirection: "row",
		padding: 8
	},
	listItemAuthorAvatarContainer: {
		alignItems: "center",
		borderRadius: 48 / 2,
		borderWidth: 2,
		borderColor: "red",
		display: "flex",
		height: 48,
		justifyContent: "center",
		marginRight: 12,
		width: 48
	},
	listItemAuthorAvatar: {
		borderRadius: 42 / 2,
		height: 38,
		width: 38
	},
	listItemAuthorName: {
		fontSize: 16,
		fontWeight: "bold",
		marginRight: 12
	},
	listItemDot: {
		backgroundColor: "#000",
		borderRadius: 4 / 2,
		height: 4,
		marginRight: 12,
		marginTop: 2,
		width: 4
	},
	listItemFollow: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#3B82F6"
	},
	listItemBody: {
		flex: 1,
		width: "100%",
		minHeight: 320
	},
	listItemImage: {
		aspectRatio: 1,
		flex: 1
	},
	videoElement: {
		flex: 1
	},
	videoOverlay: {
		bottom: 0,
		left: 0,
		position: "absolute",
		backgroundColor: "transparent",
		right: 0,
		top: 0
	},
	listItemFooter: {
		padding: 8,
		paddingLeft: 16,
		flexDirection: "row"
	},
	listItemFooterImage: {
		width: 28,
		height: 28
	},
	gap: {
		marginRight: 12
	},
	gap2: {
		marginRight: 8
	}
});

export default Post;
