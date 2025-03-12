import { firestore } from "@/lib/firebase";
import { ITask } from "./types";
import { orderBy } from "@react-native-firebase/firestore";

type tasksRead = (tasks: ITask[]) => void;

export async function getTasks(project: string, callback: tasksRead) {
  const tasks: ITask[] = [];

  const q = firestore().collection("projects").doc(project).collection("tasks");

  const unsubscribe = q.onSnapshot((querySnapshot) => {
    querySnapshot?.forEach((doc) => {
      const existingTaskIndex = tasks.findIndex((t) => t.key === doc.id);
      const taskData = {
        key: doc.id,
        task: doc.data().task,
        description: doc.data().description,
        projectId: doc.data().projectId,
        completed: doc.data().completed,
        created: doc.data().created,
        modified: doc.data().modified,
        order: doc.data().order ?? 1,
      };

      if (existingTaskIndex !== -1) {
        tasks[existingTaskIndex] = taskData;
      } else {
        tasks.push(taskData);
      }
    });
    tasks.sort((a, b) => a.order - b.order);
    callback(tasks);
  });
  return () => unsubscribe();
}
export async function addTask(project: string, task: ITask) {
  const taskRef = firestore()
    .collection("projects")
    .doc(project)
    .collection("tasks")
    .doc();

  await taskRef.set({
    ...task,
    created: firestore.Timestamp.now(),
    modified: firestore.Timestamp.now(),
  });

  return taskRef.id;
}

export async function editTask(
  project: string,
  taskId: string,
  updatedTask: Partial<ITask>,
  callback: any,
) {
  const taskRef = firestore()
    .collection("projects")
    .doc(project)
    .collection("tasks")
    .doc(taskId);

  await taskRef.update({
    ...updatedTask,
    modified: firestore.Timestamp.now(),
  });
  callback(taskId);
}

export async function updateTasks(project: string, tasks: ITask[]) {
  const batch = firestore().batch();
  const q = firestore().collection("projects").doc(project).collection("tasks");

  tasks.forEach((task) => {
    const taskRef = q.doc(task.key);
    batch.update(taskRef, task);
  });

  await batch.commit();
}

export async function setTaskOrder(project: string, tasks: ITask[]) {
  const batch = firestore().batch();
  const q = firestore().collection("projects").doc(project).collection("tasks");

  tasks.forEach((task, index) => {
    const taskRef = q.doc(task.key);
    batch.update(taskRef, { order: index });
  });

  await batch.commit();
}
