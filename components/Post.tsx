import React, { useState } from "react";
import { View, Dimensions, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";

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

	const renderPostComments = () => {
		const comments = post.comments.map((comment) => comment);
		console.log("Post: renderPostContent", comments);
		return (
			<View style={styles.commentsOverall}>
				<FlatList
					data={comments}
					renderItem={({ item }) => (
						<View style={styles.commentView}>
							<Text style={styles.commentUserName}>{item.username} </Text>
							<Text style={styles.commentText}>{item.comment}</Text>
						</View>
					)}
				/>
				<View style={styles.commentView}>
					<Text style={styles.timestamp}>{post.timestamp}</Text>
				</View>
			</View>
		);
	};

	function renderAvatar(post) {
		if (undefined != post.author && undefined != post.author.avatar && post.author.avatar.length > 0) {
			return (
				<View style={styles.avatar}>
					<Image style={styles.avatarFace} source={post.author.avatar}></Image>
				</View>
			);
		} else {
			return <View style={styles.avatar}></View>;
		}
	}
	function renderFullname(post) {
		if (undefined != post.author && undefined != post.author.fullname && post.author.fullname.length > 0) {
			return (
				<View>
					<Text style={styles.listItemAuthorName}>{post.author.fullname}</Text>
				</View>
			);
		} else {
			return <View style={styles.avatar}></View>;
		}
	}

	const imageUrls = post.images && post.images.map((image) => image);

	return (
		<View>
			<View style={styles.listItemHeader}>
				{renderAvatar(post)}
				{renderFullname(post)}
			</View>

			<View style={{ flex: 1 }}>
				<Carousel
					width={width}
					panGestureHandlerProps={{
						activeOffsetX: [-10, 10]
					}}
					height={width / 2}
					data={imageUrls}
					renderItem={({ index }) => (
						<View
							style={{
								flex: 1,
								borderWidth: 1,
								justifyContent: "center"
							}}>
							<Image
								style={styles.image}
								source={{
									uri: imageUrls[index]
								}}
							/>
						</View>
					)}
				/>
			</View>
			<View style={styles.listItemFooter}>
				<TouchableOpacity onPress={onHeartClicked}></TouchableOpacity>
			</View>
		</View>
	);
};

//source={imageUrls[index]}>

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
	avatar: {
		marginRight: 12
	},
	avatarFace: { width: 48, height: 48, borderRadius: 48 / 2 },
	listItemAuthorAvatar: {
		borderRadius: 42 / 2,
		height: 38,
		width: 38
	},
	listItemAuthorName: {
		fontSize: 16,
		marginRight: 12,
		color: "#fff"
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
		color: "lightgray"
	},
	commentView: {
		paddingBottom: 8,
		flexWrap: "wrap",
		flexDirection: "row"
	},
	commentsOverall: {
		fontSize: 14,
		color: "lightgray",
		flexWrap: "wrap"
	},
	commentUserName: {
		fontSize: 14,
		color: "lightgray",
		fontWeight: "bold"
	},
	commentText: {
		fontSize: 14,
		color: "lightgray"
	},
	timestamp: {
		fontSize: 12,
		color: "lightgray"
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
