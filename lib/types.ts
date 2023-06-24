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

export interface IUser {
    uid: string;
    photoURL: string;
    displayName: string;
    email: string;
}
