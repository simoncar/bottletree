import { Timestamp } from "firebase/firestore";

export interface IPost {
    key: string;
    projectId: string;
    caption: string;
    author?: string;
    images?: string[];
    timestamp?: Timestamp;
    comments?: IComment[];
}

export interface IProject {
    key: string;
    title: string;
    icon: string;
    archived?: boolean;
}

export interface IUser {
    uid: string;
    photoURL: string;
    displayName: string;
    email: string;
}

export interface IComment {
    key: string;
    comment: string;
    displayName: string;
    timestamp: Timestamp;
    uid: string;
}

