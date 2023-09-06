import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { setToken } from "./APINotification";
import { IPushToken } from "./types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const saveDone = (id: string) => {
  console.log("saveDone", id);
};

export async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
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
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);

    if (token) {
      let safeToken = token.replace("[", "");
      safeToken = safeToken.replace("]", "");
      safeToken = safeToken.replace("ExponentPushToken", "");

      const pushToken: IPushToken = {
        key: safeToken,
        pushToken: token,
      };

      setToken(pushToken, saveDone);
    }
  } else {
    //alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
