import { dbm } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "@react-native-firebase/firestore";
import { ITask } from "./types";

type tasksRead = (tasks: ITask[]) => void;

export async function getTasks(project: string, callback: tasksRead) {
  const tasks: ITask[] = [];

  const tasksCollection = collection(
    doc(collection(dbm, "projects"), project),
    "tasks",
  );

  const unsubscribe = onSnapshot(tasksCollection, (querySnapshot) => {
    tasks.length = 0; // Clear the array
    querySnapshot?.forEach((docSnap) => {
      const data = docSnap.data();
      const taskData = {
        key: docSnap.id,
        task: data.task ?? "",
        description: data.description ?? "",
        projectId: data.projectId,
        completed: data.completed,
        created: data.created,
        modified: data.modified,
        order: data.order ?? 1,
      };
      tasks.push(taskData);
    });
    tasks.sort((a, b) => a.order - b.order);
    callback(tasks);
  });
  return () => unsubscribe();
}

export async function addTask(project: string, task: ITask, callback: any) {
  const tasksCollection = collection(
    doc(collection(dbm, "projects"), project),
    "tasks",
  );
  const taskDocRef = doc(tasksCollection);

  task = cleanTask(task as ITask);

  await setDoc(taskDocRef, {
    ...task,
    created: serverTimestamp(),
    modified: serverTimestamp(),
  });

  callback(taskDocRef.id);
}

export async function editTask(
  project: string,
  taskId: string,
  updatedTask: Partial<ITask>,
  callback: any,
) {
  const taskRef = doc(
    collection(doc(collection(dbm, "projects"), project), "tasks"),
    taskId,
  );

  updatedTask = cleanTask(updatedTask as ITask);

  await updateDoc(taskRef, {
    ...updatedTask,
    modified: serverTimestamp(),
  });
  callback(taskId);
}

export async function updateTasks(project: string, tasks: ITask[]) {
  const batch = writeBatch(dbm);
  const tasksCollection = collection(
    doc(collection(dbm, "projects"), project),
    "tasks",
  );

  tasks.forEach((task) => {
    const taskRef = doc(tasksCollection, task.key);
    batch.update(taskRef, task);
  });

  await batch.commit();
}

export async function setTaskOrder(project: string, tasks: ITask[]) {
  const batch = writeBatch(dbm);
  const tasksCollection = collection(
    doc(collection(dbm, "projects"), project),
    "tasks",
  );

  tasks.forEach((task, index) => {
    const taskRef = doc(tasksCollection, task.key);
    batch.update(taskRef, { order: index });
  });

  await batch.commit();
}

export function cleanTask(task: ITask): ITask {
  return {
    ...task,
    task: task.task.trim(),
    description: task.description?.trim() || "",
  };
}
