// TypeScript
import { Text, TextInput, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { addTask, editTask } from "@/lib/APItasks";
import { ITask } from "@/lib/types";
import Feather from "@expo/vector-icons/Feather";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

export default function TaskScreen() {
  const { task } = useLocalSearchParams<{ task: string }>();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const [taskObj, setTask] = useState<ITask>(JSON.parse(task || "{}"));

  const saveDone = () => {
    router.back();
  };

  const save = () => {
    if (!taskObj.key) {
      addTask(taskObj.projectId, taskObj, saveDone);
    } else {
      editTask(taskObj.projectId, taskObj.key, taskObj, saveDone);
    }
  };

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPressIn={() => {
                save();
              }}>
              <Text>{t("done")}</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <View style={[styles.itemView, styles.line]}>
          <View style={styles.avatar}></View>
          <View style={styles.itemMain}>
            <TextInput
              style={styles.titleText}
              onChangeText={(title) => setTask({ ...taskObj, task: title })}
              placeholder={t("task")}
              value={taskObj.task}
              autoFocus={true}
              multiline={true}
              numberOfLines={10}
            />
          </View>
        </View>
        <View style={[styles.itemView, styles.line]}>
          <View style={styles.avatar}>
            <Feather
              name="align-left"
              size={25}
              color={Colors[colorScheme ?? "light"].textPlaceholder}
            />
          </View>
          <TextInput
            style={styles.textDescription}
            onChangeText={(description) =>
              setTask({ ...taskObj, description: description })
            }
            placeholder={t("addDescription")}
            value={taskObj.description}
            multiline
            numberOfLines={10}
            autoCapitalize="none"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  avatar: {
    justifyContent: "flex-start",
    width: 20,
    marginRight: 8,
  },
  titleText: {
    fontSize: 22,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    width: "100%",
  },
  textDescription: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 8,
    padding: 8,
    width: "90%",
  },
  optionText: {
    fontSize: 18,
    textAlign: "right",
    flex: 1,
    marginRight: 10,
  },
  title: {
    marginBottom: 20,
    height: 20,
  },
  label: {
    color: "lightgrey",
    marginBottom: 10,
    paddingLeft: 5,
  },
  itemMain: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 8,
    padding: 8,
  },

  itemView: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 8,
    padding: 8,
  },
  line: {
    borderBottomColor: "#CED0CE",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
