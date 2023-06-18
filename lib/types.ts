import { Timestamp } from "firebase/firestore";

export interface IPost {
	key: string;
	projectId: string;
	author: string;
	images: string[];
	timestamp: Timestamp;
}

export interface IProject {
	key: string;
	title: string;
	icon: string;
}
