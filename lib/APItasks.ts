import { firestore } from "@/lib/firebase";
import { ITask } from "./types";

export async function getTasks(project: string, callback: tasksRead) {
  const tasks: ITask[] = [];

  const q = firestore()
    .collection("projects")
    .doc(project)
    .collection("tasks")
    .orderBy("modified", "desc");

  const unsubscribe = q.onSnapshot((querySnapshot) => {
    querySnapshot?.forEach((doc) => {
      const existingTaskIndex = tasks.findIndex((t) => t.key === doc.id);
      const taskData = {
        key: doc.id,
        task: doc.data().task,
        projectId: doc.data().projectId,
        completed: doc.data().completed,
        created: doc.data().created,
        modified: doc.data().modified,
      };

      if (existingTaskIndex !== -1) {
        tasks[existingTaskIndex] = taskData;
      } else {
        tasks.push(taskData);
      }
    });

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
}
