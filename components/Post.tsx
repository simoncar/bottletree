import React from "react";
import { View, Dimensions, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
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

		return (
			<View style={styles.listItemBody}>
				<Carousel
					loop
					width={width}
					panGestureHandlerProps={{
						activeOffsetX: [-10, 10]
					}}
					data={[...new Array(5).keys()]}
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

	<View style={{ flexDirection: "row" }}>
		<Text style={{ flex: 1, flexWrap: "wrap" }}> You miss fdddddd dddddddd You miss fdd</Text>
	</View>;

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

	return (
		<View>
			<View style={styles.listItemHeader}>
				<View style={styles.avatar}>
					<Image style={styles.avatarFace} source={post.author.avatar}></Image>
				</View>

				<View>
					<Text style={styles.listItemAuthorName}>{post.author.fullname}</Text>
					<Text style={styles.listItemFollow}>{post.author.role}</Text>
				</View>
			</View>
			{renderPostContent()}
			<View style={styles.listItemFooter}>
				{renderPostComments()}

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
