import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { updateUserPushToken } from "./APIuser";
import { auth, firestore } from "./firebase";
import { IPushToken } from "./types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "@react-native-firebase/firestore";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const saveDoneSetToken = (id: string) => {
  console.log("saveDone Notification", id);
};

export function setToken(
  token: IPushToken,
  callback: { (id: string): void; (arg0: string): void },
) {
  if (Device.isDevice) {
    try {
      const docRef = firestore().collection("tokens").doc(token.key);

      docRef
        .set(
          {
            pushToken: token.pushToken,
            uid: auth().currentUser?.uid,
            displayName: auth().currentUser?.displayName,
            timestamp: serverTimestamp(),
          },
          { merge: true },
        )
        .then((docRef) => {
          // Call updateUserPushToken after saving the token
          if (auth().currentUser?.uid) {
            updateUserPushToken(auth().currentUser.uid, token.pushToken);
          }
          callback(token.key);
        });
    } catch (e) {
      console.error("Error adding token: ", e);
    }
  }

  return;
}

export async function getToken() {
  if (Device.isDevice) {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  } else {
    return "";
  }
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!",
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      if (pushTokenString) {
        let safeToken = pushTokenString.replace("[", "");
        safeToken = safeToken.replace("]", "");
        safeToken = safeToken.replace("ExponentPushToken", "");
        const pushToken: IPushToken = {
          key: safeToken,
          pushToken: pushTokenString,
        };
        setToken(pushToken, saveDoneSetToken);
      }
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

export async function registerForPushNotificationsAsync_old() {
  console.log("--------------------");
  let token = "";
  if (Device.isDevice) {
    console.log("ASAA  registerForPushNotificationsAsync");
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log(
        "Failed to get push token for push notification!",
        finalStatus,
      );
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      })
    ).data;
    if (token) {
      let safeToken = token.replace("[", "");
      safeToken = safeToken.replace("]", "");
      safeToken = safeToken.replace("ExponentPushToken", "");
      const pushToken: IPushToken = {
        key: safeToken,
        pushToken: token,
      };
      setToken(pushToken, saveDoneSetToken);
    }
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  } else {
    //alert("Must use physical device for Push Notifications");
  }
  return token;
}

export async function syncUserPushTokens() {
  try {
    const tokensSnapshot = await firestore().collection("tokens").get();
    if (tokensSnapshot.empty) {
      console.log("No tokens found in the tokens collection.");
      return;
    }

    tokensSnapshot.forEach(async (doc) => {
      const tokenData = doc.data();
      const uid = tokenData.uid;
      const pushToken = tokenData.pushToken;

      if (!uid) {
        console.warn(`Token with ID ${doc.id} has no associated UID.`);
        return;
      }

      const userRef = firestore().collection("users").doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        console.warn(`No user found with UID ${uid}.`);
        return;
      }

      const userData = userDoc.data();
      if (userData?.pushToken) {
        console.warn(`User with UID ${uid} already has a pushToken set.`);
        return;
      }

      if (uid && pushToken) {
        await userRef.update({
          pushToken,
          notifications: true,
        });
        console.log(
          `User push token synced successfully for UID ${uid}.`,
          pushToken,
        );
      }
    });
  } catch (error) {
    console.error("Error syncing user push tokens: ", error);
  }
}
