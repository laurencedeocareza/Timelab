import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Task } from "../lib/taskService";

interface TaskProgressChartProps {
  tasks: Task[];
}

const TaskProgressChart: React.FC<TaskProgressChartProps> = ({ tasks }) => {
  // Generate dates for the top row (last 10 days)
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 9; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push({
        day: date.getDate().toString().padStart(2, "0"),
        isToday: i === 0,
      });
    }
    return dates;
  };

  const dates = generateDates();

  // Colors for different tasks
  const taskColors = [
    "#4361EE", // Blue
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#F59E0B", // Orange
    "#10B981", // Green
    "#EF4444", // Red
  ];

  // Filter active tasks and calculate progress
  const activeTasks = tasks
    .filter((task) => task.status === "in-progress")
    .slice(0, 6);

  const getTaskProgress = (task: Task) => {
    if (task.totalSubtasks === 0) return 0;
    return Math.round((task.completedSubtasks / task.totalSubtasks) * 100);
  };

  if (activeTasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No active tasks to display</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Date header */}
      <View style={styles.dateHeader}>
        {dates.map((date, index) => (
          <View key={index} style={styles.dateItem}>
            <Text style={[styles.dateText, date.isToday && styles.todayText]}>
              {date.day}
            </Text>
          </View>
        ))}
      </View>

      {/* Task progress bars */}
      <ScrollView
        style={styles.barsContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTasks.map((task, index) => {
          const progress = getTaskProgress(task);
          const color = taskColors[index % taskColors.length];

          return (
            <View key={task.id} style={styles.taskRow}>
              <View
                style={[styles.progressBar, { backgroundColor: `${color}20` }]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progress}%`,
                      backgroundColor: color,
                    },
                  ]}
                >
                  <View style={styles.taskInfo}>
                    <View
                      style={[styles.taskDot, { backgroundColor: "#fff" }]}
                    />
                    <View style={styles.taskDetails}>
                      <Text style={styles.taskName} numberOfLines={1}>
                        {task.title}
                      </Text>
                      <Text style={styles.taskSubtitle}>
                        {task.completedSubtasks}/{task.totalSubtasks} subtasks
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.percentageText}>{progress}%</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  dateItem: {
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  todayText: {
    color: "#4361EE",
    fontWeight: "bold",
  },
  barsContainer: {
    maxHeight: 300,
  },
  taskRow: {
    marginBottom: 12,
  },
  progressBar: {
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    minWidth: 120,
  },
  taskInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  taskDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  taskDetails: {
    flex: 1,
  },
  taskName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  taskSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 11,
  },
  percentageText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 16,
  },
});

export default TaskProgressChart;
