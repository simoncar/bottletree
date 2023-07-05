import React from "react";
import * as Linking from "expo-linking";
import ParsedText from "react-native-parsed-text";

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

    return (
        <ParsedText
            style={{
                color: textColor,
            }}
            testID="story.parsedText"
            parse={[
                {
                    pattern:
                        /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,12}\b([-a-zA-Z0-9@:%_+.~#?&/=]*[-a-zA-Z0-9@:%_+~#?&/=])*/i,
                    style: {
                        color: linkColor,
                        textDecorationLine: "underline",
                    },
                    onPress: handleOpenWithLinking,
                    renderText: renderText,
                },
                {
                    type: "phone",
                    style: {
                        color: "blue",
                        textDecorationLine: "underline",
                    },
                    onPress: handlePhonePress,
                },
                {
                    type: "email",
                    style: {
                        color: linkColor,
                        textDecorationLine: "underline",
                    },
                    onPress: handleEmailPress,
                },
                {
                    pattern: /433333332/,
                    style: {
                        color: "blue",
                        textDecorationLine: "underline",
                    },
                },
                {
                    pattern: /#(\w+)/,
                    style: {
                        color: "blue",
                        textDecorationLine: "underline",
                    },
                },
            ]}
            childrenProps={{ allowFontScaling: false }}>
            {text}
        </ParsedText>
    );
};
