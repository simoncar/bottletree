import * as Application from "expo-application";
import * as Device from "expo-device";
import { dbm } from "./firebase";
import { ILog } from "./types";

import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "@react-native-firebase/firestore";

// Update getLogs to use modular API
export async function getLogs(callback: logsRead) {
  const logs: ILog[] = [];
  const logsQuery = query(
    collection(dbm, "logs"),
    orderBy("timestamp", "desc"),
  );
  const logSnapshot = await getDocs(logsQuery);

  logSnapshot.forEach((doc) => {
    const data = doc.data();
    logs.push({
      key: doc.id,
      timestamp: data.timestamp,
      loglevel: data.loglevel,
      message: data.message,
      user: data.user,
      device: data.device,
      version: data.version,
      email: data.email,
    });
  });

  callback(logs);
}

// Update addLog to use modular API
export async function addLog(log: ILog) {
  log.timestamp = serverTimestamp();
  log.device =
    Device.manufacturer +
    " > " +
    Device.modelName +
    " > " +
    Device.osName +
    " > " +
    Device.osVersion;
  log.version = Application.nativeApplicationVersion;

  try {
    const docRef = await addDoc(collection(dbm, "logs"), log);
    console.log("Log written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding log: ", e);
  }
}
