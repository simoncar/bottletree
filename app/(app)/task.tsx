// TypeScript
import React, { useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { editTask } from "@/lib/APItasks";
import Colors from "@/constants/Colors";
import { ITask } from "@/lib/types";
import { Text, TextInput, View } from "@/components/Themed";
import { useTranslation } from "react-i18next";

export default function TaskScreen() {
  const { task } = useLocalSearchParams<{ task: string }>();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const [taskObj, setTask] = useState<ITask>(JSON.parse(task || "{}"));

  const saveDone = () => {
    router.back();
  };

  const save = () => {
    console.log("save updated post :", taskObj);
    editTask(taskObj.projectId, taskObj.key, taskObj, saveDone);
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
        <Text
          style={[
            styles.label,
            { color: Colors[colorScheme ?? "light"].textDisabledColor },
          ]}>
          {t("task")}
        </Text>
        <TextInput
          style={[
            styles.titleText,
            { color: Colors[colorScheme ?? "light"].textField },
          ]}
          onChangeText={(title) => setTask({ ...taskObj, task: title })}
          placeholder={t("task")}
          value={taskObj.task}
          autoFocus={true}
          multiline={true}
          numberOfLines={10}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    width: "100%",
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
  titleText: {
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
    padding: 10,
    fontSize: 25,
    height: 100,
    minHeight: 100,
    backgroundColor: "white",
    textAlignVertical: "top",
  },
});
