import React from "react";
import { Alert, Share, View, Button } from "react-native";
import { IShareItem } from "@/lib/types";

type Props = {
  item: IShareItem;
};

export const ShareItem = async (item: Props) => {
  console.log("ShareItem: " + item);
  try {
    const result = await Share.share({
      message: item.message,
      url: item.url,
      title: item.title,
      subject: item.subject,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error: any) {
    Alert.alert(error.message);
  }
};
