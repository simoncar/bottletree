import React, { useEffect, useState, useContext } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

import Post from "./Post";
import Project from "./Project";
import { getPosts } from "../lib/APIpost";

const user = {
	id: "1",
	username: "johndoe"
};

const instagramPosts = [
	{
		id: 1,
		project: "73JwAXeOEhLXUggpVKK9",
		author: {
			id: 1,
			username: "johndoe",
			fullname: "John Doe",
			role: "Builder",
			avatar:
				"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FScreenshot%202023-05-30%20at%202.47.44%20PM.png?alt=media&token=30888878-15e6-4395-b3d4-53ae17758e33&_gl=1*pyfxsn*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ1MDg3Ni44LjEuMTY4NTQ1MDkxMS4wLjAuMA.."
		},
		username: "johndoe",
		imageUrl: "https://example.com/image1.jpg",
		images: [
			{
				imageUrl:
					"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2FIMG_4067.jpg?alt=media&token=c51daaf5-93e9-4604-b39e-2b20687d8855&_gl=1*1lv6shw*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODEzMi4wLjAuMA.."
			},
			{
				imageUrl:
					"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2FIMG_4068.jpg?alt=media&token=ff6d479d-4efc-4d5a-9187-c5a0d6158a93&_gl=1*8x2u*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODIwNy4wLjAuMA.."
			},
			{
				imageUrl:
					"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2FIMG_4072.jpg?alt=media&token=9f2c7b10-d9c1-4dd6-8d6a-5d3d32c68691&_gl=1*1o6b2in*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODIxOS4wLjAuMA.."
			}
		],
		localImage: "../assets/images/icon.png",
		caption: "Beautiful sunset at the beach! 🌅🏖️",
		likes: 1245,
		comments: [
			{
				username: "janedoe",
				comment: "What a great start 😍"
			},
			{
				username: "janedoe",
				comment: "Making progress! 🙌🏽"
			},
			{
				username: "marysmith",
				comment: "Monday the kitchen fitout people will come to measure up"
			}
		],
		timestamp: "May 29, 2023"
	},
	{
		id: 2,
		project: "73JwAXeOEhLXUggpVKK9",
		author: {
			id: 1,
			username: "johndoe",
			fullname: "John Doe",
			role: "Builder",
			avatar:
				"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FScreenshot%202023-05-30%20at%202.47.44%20PM.png?alt=media&token=30888878-15e6-4395-b3d4-53ae17758e33&_gl=1*pyfxsn*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ1MDg3Ni44LjEuMTY4NTQ1MDkxMS4wLjAuMA.."
		},
		username: "janedoe",
		images: [
			{
				imageUrl:
					"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fkitchen%2F7Z7A0836.jpg?alt=media&token=9928a99e-8e31-4b79-b9c4-d78b05f5a4f3&_gl=1*1a4fycc*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODY3MS4wLjAuMA.."
			},
			{
				imageUrl:
					"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fkitchen%2F7Z7A0891-Bearbeitet.jpg?alt=media&token=f35b4b1d-8967-40c9-963c-ad58e6bd8637&_gl=1*6slwi7*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODcyOS4wLjAuMA.."
			},
			{
				imageUrl:
					"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fkitchen%2F7Z7A0886.jpg?alt=media&token=f2988bed-052e-4cf7-a615-d94fac2c3ad1&_gl=1*142y8lf*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODcyMy4wLjAuMA.."
			},
			{
				imageUrl:
					"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fkitchen%2F7Z7A0866.jpg?alt=media&token=3edb3c14-a0b3-451e-9754-05bd2e8b6444&_gl=1*g88fp2*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODcxNy4wLjAuMA.."
			},
			{
				imageUrl:
					"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fkitchen%2F7Z7A0851.jpg?alt=media&token=ae98a768-f1d7-440e-87ea-c68719651be0&_gl=1*c1ktio*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODcxMC4wLjAuMA.."
			},
			{
				imageUrl:
					"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fkitchen%2F7Z7A0846.jpg?alt=media&token=8e4af939-223c-46ae-94ec-8f93e786a777&_gl=1*3cu6v9*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODcwMC4wLjAuMA.."
			},
			{
				imageUrl:
					"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fkitchen%2F7Z7A0841.jpg?alt=media&token=54171a09-ed81-4ee7-b441-cc4befe6a72e&_gl=1*1kmry6x*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODY5Mi4wLjAuMA.."
			}
		],
		localImage: "../assets/imagesTemp/IMG_4072.jpg",
		caption: "Exploring the city streets. #urbanlife",
		likes: 876,
		comments: [
			{
				username: "johndoe",
				comment: "Finished product is amazing! 🏙️"
			},
			{
				username: "marysmith",
				comment: "Nice and clean"
			}
		],
		timestamp: "May 30, 2023"
	},
	{
		id: 3,
		project: "H0lXilYE5g3zrMKJIDAk",
		author: {
			id: 1,
			username: "johndoe",
			fullname: "John Doe",
			role: "Builder",
			avatar:
				"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FScreenshot%202023-05-30%20at%202.47.44%20PM.png?alt=media&token=30888878-15e6-4395-b3d4-53ae17758e33&_gl=1*pyfxsn*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ1MDg3Ni44LjEuMTY4NTQ1MDkxMS4wLjAuMA.."
		},
		username: "janedoe",
		images: [
			{
				imageUrl: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FwhiteHouse.jpeg?alt=media&token=0e4f6f2d-2840-4fc3-9dac-9e3db41e6eb7"
			},
			{
				imageUrl:
					"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Froof%2FScreenshot%202023-05-30%20at%202.05.58%20PM.png?alt=media&token=35645c96-05d4-4ffc-95e4-0b805ae91981&_gl=1*1aa7ivb*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODQzOS4wLjAuMA.."
			},
			{
				imageUrl:
					"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Froof%2FScreenshot%202023-05-30%20at%202.06.03%20PM.png?alt=media&token=2bc77844-84cd-40c0-876e-591e58d05c38&_gl=1*5mtze6*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODQ0NC4wLjAuMA.."
			},
			{
				imageUrl:
					"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Froof%2FScreenshot%202023-05-30%20at%202.06.08%20PM.png?alt=media&token=4b45d612-2fb0-4abb-bf7c-82b1a5ec01c8&_gl=1*13xka9t*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODQ0OC4wLjAuMA.."
			}
		],
		localImage: "../assets/imagesTemp/IMG_4072.jpg",
		caption: "Exploring the city streets. #urbanlife",
		likes: 876,
		comments: [
			{
				username: "johndoe",
				comment: "Great energy! 🏙️"
			},
			{
				username: "marysmith",
				comment: "I like the angle of the Solar Panels"
			}
		],
		timestamp: "May 30, 2023"
	},
	{
		id: 4,
		project: "H0lXilYE5g3zrMKJIDAk",
		author: {
			id: 1,
			username: "johndoe",
			fullname: "John Doe",
			role: "Builder",
			avatar:
				"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FScreenshot%202023-05-30%20at%202.47.44%20PM.png?alt=media&token=30888878-15e6-4395-b3d4-53ae17758e33&_gl=1*pyfxsn*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ1MDg3Ni44LjEuMTY4NTQ1MDkxMS4wLjAuMA.."
		},
		username: "janedoe",
		images: [
			{
				imageUrl:
					"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Froof%2FScreenshot%202023-05-30%20at%202.05.53%20PM.png?alt=media&token=b776cb08-fc7e-4ac6-b01b-e2ff47920c76&_gl=1*cz9bbf*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODQzMy4wLjAuMA.."
			},
			{
				imageUrl:
					"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Froof%2FScreenshot%202023-05-30%20at%202.05.58%20PM.png?alt=media&token=35645c96-05d4-4ffc-95e4-0b805ae91981&_gl=1*1aa7ivb*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODQzOS4wLjAuMA.."
			},
			{
				imageUrl:
					"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Froof%2FScreenshot%202023-05-30%20at%202.06.03%20PM.png?alt=media&token=2bc77844-84cd-40c0-876e-591e58d05c38&_gl=1*5mtze6*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODQ0NC4wLjAuMA.."
			},
			{
				imageUrl:
					"https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Froof%2FScreenshot%202023-05-30%20at%202.06.08%20PM.png?alt=media&token=4b45d612-2fb0-4abb-bf7c-82b1a5ec01c8&_gl=1*13xka9t*_ga*MTc3ODA4OTA3Ni4xNjg0MTQ0OTY0*_ga_CW55HF8NVT*MTY4NTQ0ODAzMC43LjEuMTY4NTQ0ODQ0OC4wLjAuMA.."
			}
		],
		localImage: "../assets/imagesTemp/IMG_4072.jpg",
		caption: "Exploring the city streets. #urbanlife",
		likes: 876,
		comments: [
			{
				username: "johndoe",
				comment: "Great energy! 🏙️"
			},
			{
				username: "marysmith",
				comment: "I like the angle of the Solar Panels"
			}
		],
		timestamp: "May 30, 2023"
	},
	{
		id: 5,
		project: "H0lXilYE5g3zrMKJIDAk",
		author: {
			id: 1,
			username: "tapman",
			fullname: "Tony Tap",
			role: "Plumber",
			avatar: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Ftap.png?alt=media&token=594bc8d0-4764-4d6d-8c0d-049a9041dca2"
		},
		username: "tapman",
		images: [
			{
				imageUrl: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Ftaps%2Ftaps2.jpeg?alt=media&token=24059fd6-a6af-4562-932d-4d2eeea5606b"
			},
			{
				imageUrl: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Ftaps%2Ftaps3.jpeg?alt=media&token=b1657897-de6b-4535-98ce-6646cfcbb66b"
			},
			{
				imageUrl: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Ftaps%2Ftaps4.jpeg?alt=media&token=d52b54ba-9b64-4890-be3a-8ebcd42ab5b3"
			},
			{
				imageUrl: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Ftaps%2Ftaps5.jpeg?alt=media&token=7e11f9ce-4708-4182-9d18-36794f60465a"
			},
			{
				imageUrl: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Ftaps%2Ftaps1.jpeg?alt=media&token=1d9bb74f-afda-4e80-9735-e819fa9366d9"
			}
		],
		localImage: "../assets/imagesTemp/IMG_4072.jpg",
		caption: "Exploring the city streets. #urbanlife",
		likes: 876,
		comments: [
			{
				username: "johndoe",
				comment: "Looks like a great place for a tap"
			},
			{
				username: "marysmith",
				comment: "That does not look like the tap I ordered"
			}
		],
		timestamp: "May 30, 2023"
	},
	{
		id: 6,
		project: "TasX4GYjvOeRsAicmJGJ",
		author: {
			id: 1,
			username: "carpenter",
			fullname: "Colin",
			role: "Carpenter",
			avatar: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Ftap.png?alt=media&token=594bc8d0-4764-4d6d-8c0d-049a9041dca2"
		},
		username: "carpenter",
		images: [
			{
				imageUrl: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fbeachhouse.jpeg?alt=media&token=38227b43-ffad-48a1-9b3c-9d5d5c85f38a"
			},
			{
				imageUrl: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Ftaps%2Ftaps3.jpeg?alt=media&token=b1657897-de6b-4535-98ce-6646cfcbb66b"
			},
			{
				imageUrl: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Ftaps%2Ftaps4.jpeg?alt=media&token=d52b54ba-9b64-4890-be3a-8ebcd42ab5b3"
			},
			{
				imageUrl: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Ftaps%2Ftaps5.jpeg?alt=media&token=7e11f9ce-4708-4182-9d18-36794f60465a"
			},
			{
				imageUrl: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Ftaps%2Ftaps1.jpeg?alt=media&token=1d9bb74f-afda-4e80-9735-e819fa9366d9"
			}
		],
		localImage: "../assets/imagesTemp/IMG_4072.jpg",
		caption: "Exploring the city streets. #urbanlife",
		likes: 876,
		comments: [
			{
				username: "carpenter",
				comment: "Install outside deck please"
			},
			{
				username: "marysmith",
				comment: "House is a bit small so we extended with a deck"
			}
		],
		timestamp: "May 30, 2023"
	},
	{
		id: 7,
		project: "TasX4GYjvOeRsAicmJGJ",
		author: {
			id: 1,
			username: "carpenter",
			fullname: "Colin",
			role: "Carpenter",
			avatar: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2FcarpentarAvatar.png?alt=media&token=2160e66d-78bc-4cf0-97f8-601989f68fbb"
		},
		username: "carpenter",
		images: [
			{
				imageUrl: "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fdeck.jpeg?alt=media&token=e22299ae-6be8-4fb2-8bd9-6b24de539b65"
			}
		],
		localImage: "../assets/imagesTemp/IMG_4072.jpg",
		caption: "Exploring the city streets. #urbanlife",
		likes: 876,
		comments: [
			{
				username: "carpenter",
				comment: "I finished, Is this deck ok?"
			},
			{
				username: "marysmith",
				comment: "It's a bit small"
			}
		],
		timestamp: "May 30, 2023"
	}
];

//

export const Posts = (props) => {
	const { project2, isGrid } = props;
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const { project, title } = useLocalSearchParams();

	const postsRead = (postsDB) => {
		setPosts(postsDB);
		console.log("Callback postsRead", postsDB);
	};

	useEffect(() => {
		const unsubscribe = getPosts(project, postsRead);

		return () => {
			unsubscribe;
		};
	}, []);

	useEffect(() => {
		console.log("useEffect [posts]");
		//if (posts !== "" && loading === true) {
		//setProjectsList(JSON.parse(projects));
		const unsubscribe = getPosts(project, postsRead);
		setLoading(false);
		console.log("useEffect [posts]", project);
		//}
	}, [project]);

	const toggleLike = async (post) => {};
	const toggleFollow = async (post) => {};
	const onItemClicked = async (post) => {};

	const renderItems = (item) => {
		const post = item.item;
		if (isGrid) {
			return <ProfilePost post={post} onItemClicked={onItemClicked} />;
		}
		return <Post post={post} toggleLike={toggleLike} toggleFollow={toggleFollow} onItemClicked={onItemClicked} />;
	};

	const getKey = (item) => {
		return item.id;
	};

	return (
		<View style={styles.list}>
			<Project project={project} title={title} />
			<FlatList numColumns={isGrid ? 3 : 1} data={posts} renderItem={renderItems} keyExtractor={(item, index) => getKey(item)} />
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
