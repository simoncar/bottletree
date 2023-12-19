import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type CollectionReference = FirebaseFirestoreTypes.CollectionReference;
export type DocumentReference = FirebaseFirestoreTypes.DocumentReference;
export type Timestamp = FirebaseFirestoreTypes.Timestamp;

export interface IPost {
  key: string;
  projectId: string;
  projectTitle?: string;
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
  postCount: number;
}

export interface IUser {
  uid?: string;
  key?: string;
  photoURL: string;
  displayName: string;
  email: string;
  pushToken?: string;
  postCount?: Map<string, number>;
  language?: string;
}

export interface IComment {
  key?: string;
  comment: string;
  displayName: string;
  timestamp: Timestamp;
  uid: string;
}

export interface IPushToken {
  key: string;
  pushToken: string;
  uid?: string;
  displayName?: string;
  timestamp?: Timestamp;
}

export interface ICalendarEvent {
  key?: string;
  dateBegin?: Timestamp;
  dateEnd?: Timestamp;
  start?: Date;
  end?: Date;
  color?: string;
  colorName?: string;
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
