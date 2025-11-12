import {
  dbm,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  writeBatch,
} from "@/lib/firebase";
import * as SQLite from "expo-sqlite";
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

// SQLite version of getTasks for experimentation
export async function getTasksSQL(project: string, callback: tasksRead) {
  try {
    const dbs = await SQLite.openDatabaseAsync("bottletree.db");

    await dbs.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        key TEXT PRIMARY KEY,
        task TEXT NOT NULL,
        description TEXT,
        projectId TEXT,
        completed INTEGER DEFAULT 0,
        created INTEGER,
        modified INTEGER,
        "order" INTEGER DEFAULT 1
      );
    `);

    await dbs.runAsync("DELETE FROM tasks WHERE projectId = ?", [project]);

    const now = Date.now();
    const testTasks = [
      {
        key: "test-task-1",
        task: "Test Task 1",
        description: "This is the first test task",
        projectId: project,
        completed: 0,
        created: now,
        modified: now,
        order: 0,
      },
      {
        key: "test-task-2",
        task: "Test Task 2",
        description: "This is the second test task",
        projectId: project,
        completed: 0,
        created: now,
        modified: now,
        order: 1,
      },
      {
        key: "test-task-3",
        task: "Test Task 3 (Completed)",
        description: "This task is already completed",
        projectId: project,
        completed: 1,
        created: now - 86400000, // 1 day ago
        modified: now - 3600000, // 1 hour ago
        order: 2,
      },
    ];

    for (const testTask of testTasks) {
      await dbs.runAsync(
        `INSERT INTO tasks (key, task, description, projectId, completed, created, modified, "order") 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          testTask.key,
          testTask.task,
          testTask.description,
          testTask.projectId,
          testTask.completed,
          testTask.created,
          testTask.modified,
          testTask.order,
        ],
      );
    }

    const result = await dbs.getAllAsync<{
      key: string;
      task: string;
      description: string;
      projectId: string;
      completed: number;
      created: number;
      modified: number;
      order: number;
    }>(
      "SELECT * FROM tasks WHERE projectId = ? ORDER BY completed ASC, 'order' ASC",
      [project],
    );

    const tasks: ITask[] = result.map((row) => ({
      key: row.key,
      task: row.task,
      description: row.description ?? "",
      projectId: row.projectId,
      completed: Boolean(row.completed),
      created: {
        toMillis: () => row.created,
        toDate: () => new Date(row.created),
      } as any,
      modified: {
        toMillis: () => row.modified,
        toDate: () => new Date(row.modified),
      } as any,
      order: row.order ?? 1,
    }));

    callback(tasks);

    return () => {
      console.log("SQLite: No active listener to unsubscribe");
    };
  } catch (error) {
    console.error("Error in getTasksSQL:", error);
    callback([]);
    return () => {};
  }
}
