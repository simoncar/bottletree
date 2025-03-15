import { FloatingButton } from "@/components/FloatingButton";
import { ShortList } from "@/components/sComponent";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { editTask, getTasks, setTaskOrder } from "@/lib/APItasks";
import { ITask } from "@/lib/types";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  NestableDraggableFlatList,
  NestableScrollContainer,
} from "react-native-draggable-flatlist";
import Toast from "react-native-toast-message";

type SearchParams = {
  project: string;
  mode?: string;
};

export default function Tasks() {
  const { project, mode } = useLocalSearchParams<SearchParams>();
  const [tasksIncomplete, setTasksIncomplete] = useState<ITask[]>([]);
  const [tasksComplete, setTasksComplete] = useState<ITask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const colorScheme = useColorScheme();
  const inputRef = useRef<TextInput>(null);
  const { t } = useTranslation();
  const [collapsedSections, setCollapsedSections] = useState<{
    [key: string]: boolean;
  }>({
    incomplete: false,
    completed: true,
  });

  useEffect(() => {
    getTasks(project, (retrievedTasks) => {
      const incompleteTasks = retrievedTasks.filter((task) => !task.completed);
      const completeTasks = retrievedTasks.filter((task) => task.completed);
      setTasksIncomplete(incompleteTasks);
      setTasksComplete(completeTasks);

      setLoading(false);
    });
  }, []);

  const saveDone = () => {
    console.log("save Done");
  };

  const handleTaskPress = (task: ITask) => {
    router.navigate({
      pathname: "/task",
      params: { task: JSON.stringify(task) },
    });
  };

  const handleAddTaskPress = () => {
    const newTask: ITask = {
      key: "",
      task: "",
      projectId: project,
      completed: false,
      order: 0,
    };

    router.navigate({
      pathname: "/task",
      params: { task: JSON.stringify(newTask) },
    });
  };

  const toggleComplete = (task: ITask) => {
    // Toggle the task completion status
    console.log("Task completed:", task);
    // Temporarily set the task as completed for animation
    const tempTask = { ...task, completed: true };
    setTasksIncomplete((prevTasks) =>
      prevTasks.map((t) => (t.key === task.key ? tempTask : t)),
    );

    setTimeout(() => {
      // Call updateTask API after a small delay
      const updatedTask: ITask = {
        ...task,
        completed: !task.completed,
      };
      editTask(project, task.key, updatedTask, saveDone)
        .then(() => {
          if (!task.completed) {
            Toast.show({
              type: "success",
              text1: t("taskComplete"),
              text2: t("taskHasBeenSetToComplete"),
              position: "bottom",
              visibilityTime: 1000,
            });
          }
          console.log("Task updated successfully");
        })
        .catch((error) => {
          console.error("Error updating task:", error);
        });
    }, 500); // Delay for 500ms
  };

  const toggleSection = (section: string) => {
    setCollapsedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  type TaskItemProps = {
    task: ITask;
    drag: () => void;
    isActive: boolean;
    onPress: (task: ITask) => void;
  };

  const TaskItem = ({ task, drag, isActive, onPress }: TaskItemProps) => {
    return (
      <View style={styles.taskItem}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => toggleComplete(task)}>
          <FontAwesome
            name={task.completed ? "check-circle" : "circle-thin"}
            size={24}
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.taskInfo}
          disabled={isActive}
          onLongPress={drag}
          onPress={() => onPress(task)}>
          <Text
            style={[
              styles.taskName,
              task.completed && { textDecorationLine: "line-through" },
            ]}>
            {task.task}
          </Text>
          {task.description ? (
            <Text
              style={styles.taskDescription}
              numberOfLines={2}
              ellipsizeMode="tail">
              {task.description}
            </Text>
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

  const renderSectionHeader = (title: string, section: string) => {
    if (section === "incomplete") return null;
    return (
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection(section)}>
        <Text style={styles.sectionHeaderText}>{title}</Text>
        <AntDesign
          name={collapsedSections[section] ? "down" : "up"}
          size={24}
          color={Colors[colorScheme ?? "light"].text}
        />
      </TouchableOpacity>
    );
  };

  const renderItemShortlist = (item: ITask) => (
    <TaskItem
      task={item}
      onPress={handleTaskPress}
      key={item.key}
      drag={function (): void {
        console.log("dragging");
      }}
      isActive={false}
    />
  );

  const renderItem = ({ item, drag, isActive }) => (
    <TaskItem
      task={item}
      drag={drag}
      isActive={isActive}
      onPress={handleTaskPress}
      key={item.key}
    />
  );

  return (
    <View style={styles.container}>
      <FloatingButton
        title={t("addTask")}
        icon={<MaterialIcons name="add-task" size={28} color="#ffffff" />}
        onPress={handleAddTaskPress}
      />
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <View>
          <NestableScrollContainer>
            {tasksIncomplete.length > 0 && (
              <>
                {renderSectionHeader(``, "incomplete")}
                {!collapsedSections.incomplete && (
                  <View
                    style={[
                      styles.postView,
                      {
                        backgroundColor:
                          Colors[colorScheme ?? "light"].postBackground,
                        borderColor:
                          Colors[colorScheme ?? "light"].postBackground,
                      },
                    ]}>
                    <NestableDraggableFlatList
                      data={tasksIncomplete}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.key}
                      onDragEnd={({ data }) => {
                        setTasksIncomplete(data);
                        setTaskOrder(project, data);
                      }}
                    />
                  </View>
                )}
              </>
            )}
            {tasksComplete.length > 0 && (
              <View
                style={[
                  styles.postView,
                  {
                    backgroundColor:
                      Colors[colorScheme ?? "light"].postBackground,
                    borderColor: Colors[colorScheme ?? "light"].postBackground,
                  },
                ]}>
                {renderSectionHeader(
                  `${t("completed")} (${tasksComplete.length})`,
                  "completed",
                )}
                {!collapsedSections.completed && (
                  <ShortList
                    data={tasksComplete}
                    renderItem={renderItemShortlist}
                  />
                )}
              </View>
            )}
            <View style={{ height: 200 }} />
          </NestableScrollContainer>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  keyboardView: {
    flex: 1,
    zIndex: 1000,
  },
  addButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 20,
    paddingRight: 10,
  },
  predefinedTask: {
    fontSize: 16,
  },
  predefinedTaskHeader: {
    fontSize: 16,
    paddingBottom: 8,
    paddingTop: 40,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    fontSize: 20,
  },
  taskDescription: {
    color: "#666",
    marginTop: 2,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#CCC",
    marginLeft: 64,
  },
  addTask: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderColor: "lightgrey",
    borderRadius: 10,
    borderWidth: 1,
    width: 200,
    alignSelf: "center",
  },
  modalContainer: {
    backgroundColor: "green",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
  },
  input: {
    height: 80,
    borderColor: "gray",
    borderWidth: 0,
    marginBottom: 12,
    paddingHorizontal: 8,
    fontSize: 20,
    borderRadius: 12,
  },

  postView: {
    borderRadius: 10,
    borderWidth: 10,
    flex: 1,
    marginBottom: 5,
    marginHorizontal: 5,
    marginTop: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sectionHeaderText: {
    fontSize: 18,
  },
});
