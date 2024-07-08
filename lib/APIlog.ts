import { db, firestore } from "./firebase";
import { ILog } from "./types";
import * as Device from "expo-device";
import * as Application from "expo-application";

export async function getLogs(callback: logsRead) {
  const logs: ILog[] = [];

  const q = firestore().collection("logs").orderBy("timestamp", "asc");

  const logSnapshot = await q.get();

  logSnapshot.forEach((doc) => {
    logs.push({
      key: doc.id,
      timestamp: doc.data().timestamp,
      loglevel: doc.data().loglevel,
      message: doc.data().message,
      user: doc.data().user,
      device: doc.data().device,
      version: doc.data().version,
    });
  });

  callback(logs);
}

export function addLog(log: ILog) {
  // add to the passed in log object the current timestamp and details about the user device
  log.timestamp = firestore.Timestamp.now();
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
    firestore()
      .collection("logs")
      .add(log)
      .then((docRef) => {
        console.log("Log written with ID: ", docRef.id);
        return;
      });
  } catch (e) {
    console.error("Error adding log: ", e);
  }

  return;
}
