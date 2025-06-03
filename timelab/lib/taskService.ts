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
  priority: "Low" | "Medium" | "High";
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
  startDate?: Timestamp; // Add this line
  endDate?: Timestamp;
}

export const taskService = {
  // Add a new task
  async addTask(
    title: string,
    subtasks: string[],
    startDate?: Date,
    endDate?: Date
  ) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const subtaskObjects: Subtask[] = subtasks.map((subtaskTitle, index) => ({
      id: `subtask_${Date.now()}_${index}`,
      title: subtaskTitle,
      completed: false,
      priority: "Low",
    }));

    const taskData: any = {
      title,
      userId: user.uid,
      subtasks: subtaskObjects,
      completedSubtasks: 0,
      totalSubtasks: subtasks.length,
      status: "in-progress" as const,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Add date fields if provided
    if (startDate) {
      taskData.startDate = Timestamp.fromDate(startDate);
    }
    if (endDate) {
      taskData.endDate = Timestamp.fromDate(endDate);
    }

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

  // Update subtask priority
  async updateSubtaskPriority(
    taskId: string,
    subtaskId: string,
    priority: "Low" | "Medium" | "High"
  ) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    // Get current task data
    const tasks = await this.getUserTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) throw new Error("Task not found");

    // Update the subtask priority
    const updatedSubtasks = task.subtasks.map((subtask) =>
      subtask.id === subtaskId ? { ...subtask, priority } : subtask
    );

    await updateDoc(doc(db, "tasks", taskId), {
      subtasks: updatedSubtasks,
      updatedAt: Timestamp.now(),
    });
  },
  // Get tasks for a specific date range
  async getTasksInDateRange(startDate: Date, endDate: Date) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const allTasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];

    // Filter tasks that overlap with the date range
    return allTasks.filter((task) => {
      if (!task.startDate || !task.endDate) return false;

      const taskStart = task.startDate.toDate();
      const taskEnd = task.endDate.toDate();

      return taskStart <= endDate && taskEnd >= startDate;
    });
  },

  // Get tasks for a specific month
  async getTasksForMonth(year: number, month: number) {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    return this.getTasksInDateRange(startDate, endDate);
  },

  // Get monthly task statistics
  async getMonthlyTaskStats() {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const tasks = await this.getUserTasks();

    // Group tasks by month
    const monthStats = tasks.reduce((acc, task) => {
      const createdDate = task.createdAt.toDate();
      const monthKey = `${createdDate.getFullYear()}-${createdDate.getMonth()}`;

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: createdDate.toLocaleString("default", { month: "long" }),
          year: createdDate.getFullYear(),
          tasks: 0,
          completedTasks: 0,
        };
      }

      acc[monthKey].tasks += 1;
      if (task.status === "completed") {
        acc[monthKey].completedTasks += 1;
      }

      return acc;
    }, {} as Record<string, any>);

    return Object.values(monthStats);
  },
};
