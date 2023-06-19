import React from "react";
import { Dimensions, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import { View, Text } from "../components/Themed";

const { width } = Dimensions.get("window");

const Post = (props) => {
	const { post } = props;
	const router = useRouter();

	const imageUrls = post.images && post.images.map((image) => image);

	const blurhash = "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

	return (
		<View>
			<View style={styles.listItemHeader}></View>

			<View style={{ flex: 1 }}>
				<Carousel
					width={width}
					panGestureHandlerProps={{
						activeOffsetX: [-10, 10]
					}}
					height={width / 1.5}
					data={imageUrls}
					renderItem={({ index }) => (
						<Pressable
							onPress={() => {
								router.push({
									pathname: "/editPost",
									params: {
										project: post.projectId,
										key: post.key,
										image: encodeURIComponent(imageUrls[index]),
										caption: post.caption
									}
								});
							}}
							style={({ pressed }) => [
								{
									flex: 1,
									justifyContent: "center"
								}
							]}>
							<View
								style={{
									flex: 1,
									justifyContent: "center"
								}}>
								<Image
									style={styles.image}
									source={{
										uri: imageUrls[index]
									}}
									placeholder={blurhash}
								/>
							</View>
						</Pressable>
					)}
				/>
				<View style={styles.commentBlock}>
					<Text style={styles.comment}>{post.caption}</Text>
				</View>
			</View>
		</View>
	);
};

//source={imageUrls[index]}>

const styles = StyleSheet.create({
	commentBlock: {
		padding: 8
	},
	comment: {
		fontSize: 16
	},
	image: {
		flex: 1,
		width: "100%",
		backgroundColor: "#0553",
		height: 300
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
