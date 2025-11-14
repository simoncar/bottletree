import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "@/components/Themed";

interface TProps {
  icon: React.ReactNode;
  onPress?: () => any;
  title: string;
  subTitle?: string;
  titleInfoStyle?: string;
  titleInfo?: string;
  hasNavArrow?: boolean;
  lastItem?: boolean;
}

export function Separator() {
  return <View style={styles.separator} />;
}

export function SettingsListItem(props: TProps) {
  const {
    icon,
    onPress,
    title,
    subTitle = "",
    titleInfo = "",
    hasNavArrow = true,
    lastItem = false,
  } = props;

  function renderSubTitle(subTitle: string) {
    if (subTitle != "") {
      return (
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.subtitle}>
          {subTitle}
        </Text>
      );
    } else return null;
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={lastItem ? styles.outerViewLast : styles.outerView}>
        {icon}
        <View style={styles.innerView}>
          <View>
            <Text style={styles.textTitle}>{title || ""}</Text>
            {renderSubTitle(subTitle)}
          </View>

          <View>
            <Text style={styles.textTitleInfo}>{titleInfo || ""}</Text>
          </View>
        </View>

        <View style={styles.rightChevron}>
          {hasNavArrow && (
            <Feather name="chevron-right" size={22} color="#777777" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  innerView: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  outerView: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    height: 80,
    paddingVertical: 8,
    padding: 8,
  },
  outerViewLast: {
    alignItems: "center",
    borderBottomColor: "#CED0CE",
    flexDirection: "row",
    height: 80,
    paddingVertical: 8,
    padding: 8,
  },
  rightChevron: {
    marginHorizontal: 8,
  },
  separator: {
    backgroundColor: "#CED0CE",
    height: 1,
    marginTop: 30,
    width: "100%",
  },
  subtitle: {
    color: "#777777",
  },
  textTitle: {
    fontSize: 18,
  },
  textTitleInfo: {
    fontSize: 18,
  },
});
