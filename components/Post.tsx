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
							]}
						>
							<View
								style={{
									flex: 1,
									justifyContent: "center"
								}}
							>
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
	
});

export default Post;
