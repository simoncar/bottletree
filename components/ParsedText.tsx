import React from "react";
import * as Linking from "expo-linking";
import { View } from "./Themed";

export const ParsedTextUnthemed = (props) => {
  const { text, textColor, linkColor } = props;

  const handleOpenWithLinking = (sURL: string) => {
    Linking.openURL(sURL);
  };
  const handleEmailPress = (email: string) => {
    Linking.openURL("mailto:" + email);
  };
  const handlePhonePress = (phone: string) => {
    Linking.openURL("tel:" + phone);
  };
  const renderText = (sURL: string) => {
    const { hostname, path, queryParams } = Linking.parse(sURL);
    return hostname + "/" + path;
  };

  const renderName = (sName: string) => {
    return sName.slice(1);
  };

  function trimFirstLastChars(inputString: string) {
    if (inputString.length <= 2) {
      return "";
    } else {
      return inputString.slice(1, -1);
    }
  }

  return (
   <View />
  );
};
