import {
  FieldValue,
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { ICalendarEventBase } from "react-native-big-calendar";

export type CollectionReference = FirebaseFirestoreTypes.CollectionReference;
export type DocumentReference = FirebaseFirestoreTypes.DocumentReference;
export type Timestamp = FirebaseFirestoreTypes.Timestamp;

export interface IPost {
  key: string;
  projectId: string;
  projectTitle?: string;
  caption: string;
  author?: string;
  uid?: string;
  images?: {
    ratio: number;
    url: string;
  }[];
  timestamp?: Timestamp | FieldValue;
  ratio?: number;
  comments?: IComment[];
  linkURL?: string;
  file?: string;
}

export interface IProject {
  project: string;
  key: string;
  title: string;
  icon: string;
  archived?: boolean;
  postCount?: number;
  taskCount?: number;
  fileCount?: number;
  timestamp?: Timestamp | FieldValue;
  private: boolean;
  created?: Timestamp | FieldValue;
  star?: boolean;
  allowedUsers?: string[];
  owner?: string;
}

export interface ILog {
  loglevel: string;
  message: string;
  key?: string;
  timestamp?: Timestamp | FieldValue;
  uid?: string;
  email?: string;
  device?: string;
  version?: string;
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
  project: string;
  anonymous: boolean;
  notifications?: boolean;
  created?: Timestamp | FieldValue;
  lastLogin?: Timestamp | FieldValue;
}

export interface IComment {
  key?: string;
  comment: string;
  displayName: string;
  timestamp: Timestamp | FieldValue;
  uid: string;
}

export interface IPushToken {
  key: string;
  pushToken: string;
  uid?: string;
  displayName?: string;
  timestamp?: Timestamp | FieldValue;
}

export interface IShareItem {
  message: string;
  url: string;
  title: string;
  subject: Timestamp;
}

export interface ICalendarEvent {
  key?: string;
  dateBegin?: Timestamp | FieldValue;
  dateEnd?: Timestamp | FieldValue;
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

//type to store files
export interface IFile {
  key: string;
  filename: string;
  url: string;
  mimeType: string;
  bytes: number;
  projectId: string;
  created: Timestamp | FieldValue;
  modified: Timestamp | FieldValue;
}

//type to store tasks
export interface ITask {
  key?: string;
  task: string;
  description?: string;
  projectId: string;
  completed: boolean;
  created?: Timestamp | FieldValue;
  modified?: Timestamp | FieldValue;
  order?: number;
}

export interface CustomCalendarEvent extends ICalendarEventBase {
  id: string;
  summary: string;
  color: string;
  isFullDayEvent: boolean;
  timeCreated: Date;
}
