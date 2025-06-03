"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { taskService, Task } from "../../lib/taskService";
import AddTaskModal from "../../components/AddTaskModal";
import { userService } from "../../lib/userService";
import TaskProgressChart from "../../components/TaskProgressChart";
import { goalService } from "../../lib/goalService";
import HorizontalCalendar from "../../components/HorizontalCalendar";
import TaskProgressBar from "../../components/TaskProgressBar";

const { width } = Dimensions.get("window");

// Month data for the 12 month cards
const months = [
  { name: "January", color: "#4361EE", tasks: 5 },
  { name: "February", color: "#F9703B", tasks: 8 },
  { name: "March", color: "#10B981", tasks: 3 },
  { name: "April", color: "#8B5CF6", tasks: 7 },
  { name: "May", color: "#EC4899", tasks: 4 },
  { name: "June", color: "#F59E0B", tasks: 6 },
  { name: "July", color: "#3B82F6", tasks: 9 },
  { name: "August", color: "#EF4444", tasks: 2 },
  { name: "September", color: "#14B8A6", tasks: 5 },
  { name: "October", color: "#6366F1", tasks: 7 },
  { name: "November", color: "#8B5CF6", tasks: 4 },
  { name: "December", color: "#F97316", tasks: 8 },
];
const monthColors = [
  "#4361EE",
  "#F9703B",
  "#10B981",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
  "#3B82F6",
  "#EF4444",
  "#14B8A6",
  "#6366F1",
  "#8B5CF6",
  "#F97316",
];
interface MonthData {
  name: string;
  color: string;
  tasks: number;
  goals: number;
  month: number;
  year: number;
}

export default function Dashboard() {
  const [monthlyData, setMonthlyData] = useState<MonthData[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasksInDateRange, setTasksInDateRange] = useState<Task[]>([]);
  const router = useRouter();
  const [username, setUsername] = useState("User");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const updateTasksInDateRange = (date: Date, allTasks: Task[] = tasks) => {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const tasksInRange = allTasks.filter((task) => {
      if (!task.startDate || !task.endDate) return false;

      const taskStart = task.startDate.toDate();
      const taskEnd = task.endDate.toDate();

      return taskStart <= endDate && taskEnd >= startDate;
    });

    setTasksInDateRange(tasksInRange);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    updateTasksInDateRange(date);
  };

  const getTaskDates = (): Date[] => {
    const dates: Date[] = [];
    tasks.forEach((task) => {
      if (task.startDate && task.endDate) {
        const start = task.startDate.toDate();
        const end = task.endDate.toDate();

        const currentDate = new Date(start);
        while (currentDate <= end) {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });
    return dates;
  };

  useEffect(() => {
    const unsubscribe = taskService.subscribeToUserTasks((userTasks) => {
      setTasks(userTasks);
      setLoading(false);
    });
    const loadUserProfile = async () => {
      try {
        const profile = await userService.getCurrentUserProfile();
        if (profile) {
          setUserProfile(profile);
          setUsername(profile.fullName.split(" ")[0]); // Use first name only
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };

    loadUserProfile();

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi {username}</Text>
            <Text style={styles.subGreeting}>Here are your projects</Text>
          </View>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{username.charAt(0)}</Text>
            </View>
          </View>
        </View>

        {/* Month Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cardsContainer}
          contentContainerStyle={styles.cardsContent}
        >
          {monthlyData.map((month, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: month.color }]}
              onPress={() => {
                const monthDate = new Date(month.year, month.month, 1);
                handleDateChange(monthDate);
              }}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="calendar" size={20} color="#fff" />
                </View>
              </View>
              <View style={styles.cardDots}>
                {[...Array(8)].map((_, i) => (
                  <View key={i} style={styles.cardDot} />
                ))}
              </View>
              <Text style={styles.cardTitle}>{month.name}</Text>
              <Text style={styles.cardSubtitle}>Overview</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>
                  {month.tasks} Tasks • {month.goals} Goals
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Horizontal Calendar */}
        <HorizontalCalendar
          onDateChange={handleDateChange}
          selectedDate={selectedDate}
          taskDates={getTaskDates()}
        />

        {/* Task Progress Bars */}
        {tasksInDateRange.length > 0 && (
          <View style={styles.taskProgressSection}>
            <Text style={styles.sectionTitle}>Task Timeline</Text>
            <View style={styles.taskProgressContainer}>
              {tasksInDateRange.map((task) => {
                if (!task.startDate || !task.endDate) return null;

                const progress =
                  (task.completedSubtasks / task.totalSubtasks) * 100;
                const calendarStart = new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth(),
                  1
                );
                const calendarEnd = new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth() + 1,
                  0
                );

                return (
                  <TaskProgressBar
                    key={task.id}
                    task={{
                      id: task.id,
                      title: task.title,
                      startDate: task.startDate.toDate(),
                      endDate: task.endDate.toDate(),
                      progress,
                      color:
                        monthColors[
                          Math.floor(Math.random() * monthColors.length)
                        ],
                    }}
                    currentDate={selectedDate}
                    calendarStartDate={calendarStart}
                    calendarEndDate={calendarEnd}
                  />
                );
              })}
            </View>
          </View>
        )}

        {/* Chart Section */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Task Progress Overview</Text>
          <TaskProgressChart tasks={tasks} />
        </View>

        {/* Tasks Section */}
        <View style={styles.tasksSection}>
          <View style={styles.tasksSectionHeader}>
            <Text style={styles.sectionTitle}>Personal Tasks</Text>
            <TouchableOpacity
              style={styles.addTaskButton}
              onPress={() => setShowAddTaskModal(true)}
            >
              <Ionicons name="add" size={20} color="#4361EE" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading tasks...</Text>
            </View>
          ) : tasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="clipboard-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No tasks yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to add your first task
              </Text>
            </View>
          ) : (
            tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskItem}
                onPress={() => router.push(`/tasks?id=${task.id}`)}
              >
                <View
                  style={[
                    styles.taskIcon,
                    {
                      backgroundColor:
                        task.status === "completed" ? "#10B981" : "#F9703B",
                    },
                  ]}
                >
                  <Ionicons
                    name={task.status === "completed" ? "checkmark" : "time"}
                    size={16}
                    color="#fff"
                  />
                </View>
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskTime}>
                    {task.status === "completed" ? "Completed" : "In Progress"}{" "}
                    · {task.completedSubtasks}/{task.totalSubtasks} subtasks
                  </Text>
                </View>
                <View style={styles.taskStatus}>
                  <View
                    style={[
                      styles.taskStatusDot,
                      {
                        backgroundColor:
                          task.status === "completed" ? "#10B981" : "#F9703B",
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
        {/* Add Task Modal */}
        <AddTaskModal
          visible={showAddTaskModal}
          onClose={() => setShowAddTaskModal(false)}
          onTaskAdded={() => {
            // Tasks will update automatically via the real-time listener
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  subGreeting: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  avatarContainer: {
    width: 60, // Increased from 50
    height: 60, // Increased from 50
    borderRadius: 30, // Increased from 25
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 56, // Increased from 46
    height: 56, // Increased from 46
    borderRadius: 28, // Increased from 23
    backgroundColor: "#F9703B",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24, // Increased from 20
    fontWeight: "bold",
    color: "#fff",
  },
  cardsContainer: {
    marginTop: 20,
  },
  cardsContent: {
    paddingHorizontal: 15,
    paddingRight: 20,
  },
  card: {
    width: 150,
    height: 180,
    borderRadius: 16,
    marginHorizontal: 5,
    padding: 16,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cardIconContainer: {
    width: 42, // Increased from 36
    height: 42, // Increased from 36
    borderRadius: 10, // Increased from 8
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardDots: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "70%",
    marginVertical: 10,
  },
  cardDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    margin: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  cardFooter: {
    marginTop: 10,
  },
  cardFooterText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  chartSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 15,
  },
  tasksSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  taskIcon: {
    width: 44, // Increased from 36
    height: 44, // Increased from 36
    borderRadius: 10, // Increased from 8
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  taskIconText: {
    fontSize: 18, // Increased from 16
    fontWeight: "bold",
    color: "#fff",
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  taskTime: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  taskStatus: {
    padding: 4,
  },
  taskStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F9703B",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  navItem: {
    alignItems: "center",
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F9703B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#F9703B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  // Add these new styles to your existing styles object
  tasksSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  addTaskButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F4FF",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    color: "#6B7280",
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },
  taskProgressSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  taskProgressContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskDates: {
    fontSize: 11,
    color: "#9CA3AF",
  },
});
