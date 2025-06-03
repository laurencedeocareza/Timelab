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

export interface GoalItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface WeeklyGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  monthId: string;
  month: string;
  year: number;
  weekNumber: number;
  items: GoalItem[];
  completedItems: number;
  totalItems: number;
  status: "not-started" | "in-progress" | "completed";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const goalService = {
  // Add a new weekly goal
  async addWeeklyGoal(
    title: string,
    description: string,
    category: string,
    monthId: string,
    month: string,
    year: number,
    weekNumber: number,
    items: string[]
  ) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const goalItems: GoalItem[] = items.map((itemTitle, index) => ({
      id: `item_${Date.now()}_${index}`,
      title: itemTitle,
      completed: false,
    }));

    const goalData = {
      title,
      description,
      category,
      monthId,
      month,
      year,
      weekNumber,
      items: goalItems,
      completedItems: 0,
      totalItems: items.length,
      status: "not-started" as const,
      userId: user.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "weeklyGoals"), goalData);
    return docRef.id;
  },

  // Get user's weekly goals
  async getUserWeeklyGoals() {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "weeklyGoals"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as WeeklyGoal[];
  },

  // Get weekly goals for a specific month
  async getWeeklyGoalsByMonth(monthId: string) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "weeklyGoals"),
      where("userId", "==", user.uid),
      where("monthId", "==", monthId),
      orderBy("weekNumber", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as WeeklyGoal[];
  },

  // Subscribe to weekly goals for real-time updates
  subscribeToWeeklyGoals(callback: (goals: WeeklyGoal[]) => void) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "weeklyGoals"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (querySnapshot) => {
      const goals = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WeeklyGoal[];
      callback(goals);
    });
  },

  // Update goal item completion status
  async updateGoalItemStatus(
    goalId: string,
    itemId: string,
    completed: boolean
  ) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    // Get the current goal
    const goals = await this.getUserWeeklyGoals();
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) throw new Error("Goal not found");

    // Update the item
    const updatedItems = goal.items.map((item) =>
      item.id === itemId ? { ...item, completed } : item
    );

    // Count completed items
    const completedItems = updatedItems.filter((item) => item.completed).length;

    // Determine status
    let status: "not-started" | "in-progress" | "completed" = "not-started";
    if (completedItems === 0) {
      status = "not-started";
    } else if (completedItems === updatedItems.length) {
      status = "completed";
    } else {
      status = "in-progress";
    }

    // Update the goal
    await updateDoc(doc(db, "weeklyGoals", goalId), {
      items: updatedItems,
      completedItems,
      status,
      updatedAt: Timestamp.now(),
    });
  },

  // Add a new item to an existing goal
  async addGoalItem(goalId: string, itemTitle: string) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    // Get the current goal
    const goals = await this.getUserWeeklyGoals();
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) throw new Error("Goal not found");

    // Create new item
    const newItem: GoalItem = {
      id: `item_${Date.now()}`,
      title: itemTitle,
      completed: false,
    };

    // Add to items array
    const updatedItems = [...goal.items, newItem];

    // Update the goal
    await updateDoc(doc(db, "weeklyGoals", goalId), {
      items: updatedItems,
      totalItems: updatedItems.length,
      updatedAt: Timestamp.now(),
    });
  },

  // Delete a weekly goal
  async deleteWeeklyGoal(goalId: string) {
    await deleteDoc(doc(db, "weeklyGoals", goalId));
  },

  // Get monthly goal statistics
  async getMonthlyGoalStats() {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const goals = await this.getUserWeeklyGoals();

    // Group goals by month and count
    const monthStats = goals.reduce((acc, goal) => {
      const key = `${goal.month}-${goal.year}`;
      if (!acc[key]) {
        acc[key] = {
          id: goal.monthId,
          month: goal.month,
          year: goal.year,
          goals: 0,
          color: getMonthColor(goal.month),
        };
      }
      acc[key].goals += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(monthStats);
  },
};

// Helper function to get a color for each month
function getMonthColor(month: string) {
  const colors = {
    January: "#8B5CF6",
    February: "#EC4899",
    March: "#F59E0B",
    April: "#10B981",
    May: "#3B82F6",
    June: "#EF4444",
    July: "#8B5CF6",
    August: "#EC4899",
    September: "#F59E0B",
    October: "#10B981",
    November: "#3B82F6",
    December: "#EF4444",
  };
  return colors[month as keyof typeof colors] || "#6B7280";
}
