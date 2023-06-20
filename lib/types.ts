import { Timestamp } from "firebase/firestore";

export interface IPost {
	key: string;
	projectId: string;
	author: string;
	images: string[];
	timestamp: Timestamp;
	caption: string;
}

export interface IProject {
	key: string;
	title: string;
	icon: string;
}

export interface IProjectUsers {
	key: string;
	avatar: string;
	name: string;
}
