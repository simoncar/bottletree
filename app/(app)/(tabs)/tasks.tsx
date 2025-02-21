import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { Text } from "@/components/Themed";
import { addTask, editTask, getTasks } from "@/lib/APItasks";
import { ITask } from "@/lib/types";
import Colors from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Timestamp } from "firebase/firestore";
import { useLocalSearchParams, router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { MaterialIcons } from "@expo/vector-icons";

type SearchParams = {
  project: string; //project ID
};

export default function Tasks() {
  const { project } = useLocalSearchParams<SearchParams>();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const colorScheme = useColorScheme();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [newTaskName, setNewTaskName] = useState<string>("");

  useEffect(() => {
    getTasks(project, (retrievedTasks) => {
      setTasks(() => [...retrievedTasks]);
      console.log("getTasks >>:", retrievedTasks);
      setLoading(false);
    });
  }, []);

  const handleTaskPress = (task: ITask) => {
    // Handle file selection
    console.log("File selected:", task);
  };

  const handleAddTaskPress = () => {
    setModalVisible(true);
  };

  const toggleComplete = (task: ITask) => {
    // Toggle the task completion status
    console.log("Task completed:", task);
    //call updateTask API
    const updatedTask: ITask = {
      ...task,
      completed: !task.completed,
    };
    editTask(project, task.key, updatedTask)
      .then(() => {
        console.log("AAAA:", tasks);

        // setTasks((prevTasks) =>
        //   prevTasks.map((t) =>
        //     t.key === task.key ? { ...t, completed: !t.completed } : t,
        //   ),
        // );

        console.log("AAAABBBB:", tasks);
        console.log("AAAACCCC:", updatedTask);
        console.log("Task updated successfully");
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };

  const handleSaveTask = () => {
    // Save the new task
    console.log("New task name:", newTaskName);
    //call addTask API
    const newTask: ITask = {
      task: newTaskName,
      projectId: project,
      completed: false,
      // Add other necessary fields here
    };

    addTask(project, newTask)
      .then(() => {
        // setTasks((prevTasks) => [...prevTasks, { ...newTask }]);
        console.log("Task added successfully");
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
    setModalVisible(false);
    setNewTaskName("");
  };

  type TaskItemProps = {
    task: ITask;
    onPress: (task: ITask) => void;
  };

  const TaskItem = ({ task, onPress }: TaskItemProps) => {
    console.log("taskItem:", task);
    // const formattedDate = formatDate(task.modified);

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
        <TouchableOpacity style={styles.taskInfo} onPress={() => onPress(task)}>
          <Text style={styles.taskName}>{task.task}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }: { item: ITask }) => (
    <TaskItem task={item} onPress={handleTaskPress} />
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addTask} onPress={handleAddTaskPress}>
        <Text style={styles.addButtonText}>Add Task</Text>
        <MaterialIcons
          name="add-task"
          size={24}
          color={Colors[colorScheme ?? "light"].textDisabledColor}
        />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.key.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <View>
              <Text style={{ textAlign: "center", padding: 16 }}>
                No tasks found
              </Text>
            </View>
          )}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="New Task"
              value={newTaskName}
              onChangeText={setNewTaskName}
            />
            <Button title="Save" onPress={handleSaveTask} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingRight: 10,
  },
  predefinedTask: {
    fontSize: 16,
  },
  predefinedTaskHeader: {
    fontSize: 16,
    fontWeight: "bold",
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
    fontSize: 16,
    fontWeight: "500",
  },
  taskDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 0,
    marginBottom: 12,
    paddingHorizontal: 8,
    fontSize: 18,
    borderRadius: 12,
  },
});
