import { dbm } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  getDocs,
  updateDoc,
  writeBatch,
  query,
  orderBy,
} from "@react-native-firebase/firestore";
import { ITask } from "./types";

type tasksRead = (tasks: ITask[]) => void;

export async function getTasks(project: string, callback: tasksRead) {
  const tasksCollection = collection(
    doc(collection(dbm, "projects"), project),
    "tasks",
  );

  const unsubscribe = onSnapshot(tasksCollection, (querySnapshot) => {
    const allTasks: ITask[] = [];
    querySnapshot?.forEach((docSnap) => {
      const data = docSnap.data();
      allTasks.push({
        key: docSnap.id,
        task: data.task ?? "",
        description: data.description ?? "",
        projectId: data.projectId,
        completed: data.completed,
        created: data.created,
        modified: data.modified,
        order: data.order ?? 1,
      });
    });

    const incompleteTasks = allTasks.filter((task) => !task.completed);
    const completedTasks = allTasks.filter((task) => task.completed);

    // Sort incomplete tasks by order
    incompleteTasks.sort((a, b) => a.order - b.order);

    // Sort completed tasks by modified date, descending
    completedTasks.sort((a, b) => {
      if (a.modified && b.modified) {
        return b.modified.toMillis() - a.modified.toMillis();
      }
      return 0;
    });

    callback([...incompleteTasks, ...completedTasks]);
  });
  return () => unsubscribe();
}

export async function addTask(project: string, task: ITask, callback: any) {
  const tasksCollection = collection(
    doc(collection(dbm, "projects"), project),
    "tasks",
  );
  const taskDocRef = doc(tasksCollection);

  const querySnapshot = await getDocs(
    query(tasksCollection, orderBy("order", "asc")),
  );

  const batch = writeBatch(dbm);

  querySnapshot.forEach((docSnap, idx) => {
    const existingOrder = idx + 1;
    const taskRef = doc(tasksCollection, docSnap.id);
    batch.update(taskRef, { order: existingOrder + 1 });
  });

  // Commit batch updates
  await batch.commit();

  // Clean and add the new task at order 0
  task = cleanTask(task as ITask);

  await setDoc(taskDocRef, {
    ...task,
    order: 0,
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
