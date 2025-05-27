import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../FirebaseConfig";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  userId: string;
  subtasks: Subtask[];
  completedSubtasks: number;
  totalSubtasks: number;
  status: "in-progress" | "completed";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const taskService = {
  // Add a new task
  async addTask(title: string, subtasks: string[]) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const subtaskObjects: Subtask[] = subtasks.map((subtaskTitle, index) => ({
      id: `subtask_${Date.now()}_${index}`,
      title: subtaskTitle,
      completed: false,
    }));

    const taskData = {
      title,
      userId: user.uid,
      subtasks: subtaskObjects,
      completedSubtasks: 0,
      totalSubtasks: subtasks.length,
      status: "in-progress" as const,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "tasks"), taskData);
    return docRef.id;
  },

  // Get user's tasks
  async getUserTasks() {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];
  },

  // Listen to user's tasks in real-time
  subscribeToUserTasks(callback: (tasks: Task[]) => void) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      callback(tasks);
    });
  },

  // Update subtask completion
  async updateSubtaskCompletion(
    taskId: string,
    subtaskId: string,
    completed: boolean
  ) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    // First get the current task data
    const tasks = await this.getUserTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) throw new Error("Task not found");

    // Update the subtask
    const updatedSubtasks = task.subtasks.map((subtask) =>
      subtask.id === subtaskId ? { ...subtask, completed } : subtask
    );

    const completedCount = updatedSubtasks.filter((st) => st.completed).length;
    const newStatus =
      completedCount === updatedSubtasks.length ? "completed" : "in-progress";

    await updateDoc(doc(db, "tasks", taskId), {
      subtasks: updatedSubtasks,
      completedSubtasks: completedCount,
      status: newStatus,
      updatedAt: Timestamp.now(),
    });
  },

  // Delete a task
  async deleteTask(taskId: string) {
    await deleteDoc(doc(db, "tasks", taskId));
  },
};
