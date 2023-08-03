import { Timestamp } from "firebase/firestore";

export interface IPost {
  key: string;
  projectId: string;
  caption: string;
  author?: string;
  images?: string[];
  ratio?: number;
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
  key?: string;
  comment: string;
  displayName: string;
  timestamp: Timestamp;
  uid: string;
}

export interface ICalendarEvent {
  key?: string;
  dateBegin: Timestamp;
  dateEnd: Timestamp;
  description: string;
  projectId?: string;
  title: string;
  uid: string;
  extensionTitle?: string;
  extensionDateBeginSplit?: string;
  extensionDateEndSplit?: string;
  extensionTimeBegin?: string;
  extensionTimeEnd?: string;
}
