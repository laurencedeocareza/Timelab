import React, { useState, useEffect } from "react";
import { taskService, Task } from "../lib/taskService";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// Get screen dimensions
const { width } = Dimensions.get("window");

// Types for task details

// Sample data for the demonstration

// Technique icons and colors
const techniques = {
  pomodoro: {
    name: "Pomodoro Technique",
    icon: "timer-outline",
    color: "#FF6347",
  },
  timeboxing: {
    name: "Timeboxing",
    icon: "calendar",
    color: "#4682B4",
  },
  flowtime: {
    icon: "water",
    color: "#6A5ACD",
  },
};

export default function TaskDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskId = params.id?.toString() || "";

  // State for Firebase data
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTechnique, setCurrentTechnique] =
    useState<keyof typeof techniques>("pomodoro");

  // Load task data from Firebase
  useEffect(() => {
    const loadTask = async () => {
      try {
        const tasks = await taskService.getUserTasks();
        const task = tasks.find((t) => t.id === taskId);
        setTaskDetails(task || null);
      } catch (error) {
        console.error("Error loading task:", error);
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      loadTask();
    } else {
      setLoading(false);
    }
  }, [taskId]);

  const handleSubtaskPress = async (subtask: {
    id: string;
    title: string;
    completed: boolean;
  }) => {
    try {
      await taskService.updateSubtaskCompletion(
        taskId,
        subtask.id,
        !subtask.completed
      );
      // Reload task data
      const tasks = await taskService.getUserTasks();
      const updatedTask = tasks.find((t) => t.id === taskId);
      setTaskDetails(updatedTask || null);
    } catch (error) {
      console.error("Error updating subtask:", error);
    }
  };

  // Progress indicators
  const progressSteps = [
    "Not Started",
    "In Progress",
    "Almost Done",
    "Completed",
  ];
  const progressColors = ["#E0E0E0", "#FFD700", "#FFA500", "#4CAF50"];
  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text>Loading task...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Task not found state
  if (!taskDetails) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text>Task not found</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.startButton}
          >
            <Text style={styles.startButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#2A2A5A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{taskDetails.title}</Text>
        </View>

        {/* Task description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            Task with {taskDetails.totalSubtasks} subtasks
          </Text>

          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>
              Status:{" "}
              {taskDetails.status === "completed" ? "Completed" : "In Progress"}
            </Text>
            <View style={styles.progressBar}>
              {[0, 1, 2, 3].map((step) => {
                const progressValue =
                  taskDetails.status === "completed"
                    ? 3
                    : taskDetails.completedSubtasks === 0
                    ? 0
                    : taskDetails.completedSubtasks ===
                      taskDetails.totalSubtasks
                    ? 3
                    : taskDetails.completedSubtasks >
                      taskDetails.totalSubtasks / 2
                    ? 2
                    : 1;

                return (
                  <View
                    key={step}
                    style={[
                      styles.progressStep,
                      {
                        backgroundColor:
                          step <= progressValue
                            ? progressColors[step]
                            : "#E0E0E0",
                      },
                    ]}
                  />
                );
              })}
            </View>
          </View>
        </View>

        {/* Technique selector */}
        <View style={styles.techniqueContainer}>
          <Text style={styles.sectionTitle}>Focus Technique</Text>
          <View style={styles.techniquesRow}>
            {Object.entries(techniques).map(([key, tech]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.techniqueButton,
                  currentTechnique === key && {
                    borderColor: tech.color,
                    borderWidth: 2,
                  },
                ]}
                onPress={() =>
                  setCurrentTechnique(key as keyof typeof techniques)
                }
              >
                {key === "flowtime" ? (
                  <MaterialCommunityIcons
                    name={tech.icon as any}
                    size={24}
                    color={tech.color}
                  />
                ) : (
                  <Ionicons
                    name={tech.icon as any}
                    size={24}
                    color={tech.color}
                  />
                )}
                <Text style={[styles.techniqueName, { color: tech.color }]}>
                  {"name" in tech
                    ? tech.name
                    : key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Subtasks list */}
        <View style={styles.subtasksContainer}>
          <Text style={styles.sectionTitle}>Subtasks</Text>
          <FlatList
            data={taskDetails.subtasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.subtaskItem}
                onPress={() => handleSubtaskPress(item)}
              >
                <View style={styles.subtaskContent}>
                  <View style={styles.subtaskLeft}>
                    <View
                      style={[
                        styles.statusIndicator,
                        {
                          backgroundColor: item.completed
                            ? "#4CAF50"
                            : "#FFD700",
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.subtaskText,
                        item.completed && styles.completedText,
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>
                  <View style={styles.subtaskRight}>
                    <Text style={styles.statusText}>
                      {item.completed ? "Completed" : "In Progress"}
                    </Text>
                    <Ionicons name="chevron-forward" size={18} color="#999" />
                  </View>
                </View>
              </TouchableOpacity>
            )}
            style={styles.subtasksList}
          />
        </View>

        {/* Start focused work button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            const firstIncomplete = taskDetails.subtasks.find(
              (st) => !st.completed
            );
            if (firstIncomplete) {
              handleSubtaskPress(firstIncomplete);
            } else {
              handleSubtaskPress(taskDetails.subtasks[0]);
            }
          }}
        >
          {currentTechnique === "flowtime" ? (
            <MaterialCommunityIcons
              name={techniques[currentTechnique].icon as any}
              size={24}
              color="white"
            />
          ) : (
            <Ionicons
              name={techniques[currentTechnique].icon as any}
              size={24}
              color="white"
            />
          )}
          <Text style={styles.startButtonText}>Start Focused Work</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2A2A5A",
    marginLeft: 10,
    flex: 1,
  },
  descriptionContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  descriptionText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
    lineHeight: 22,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  progressBar: {
    flexDirection: "row",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressStep: {
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2A2A5A",
    marginBottom: 12,
  },
  techniqueContainer: {
    marginBottom: 20,
  },
  techniquesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  techniqueButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  techniqueName: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 8,
    textAlign: "center",
  },
  subtasksContainer: {
    flex: 1,
  },
  subtasksList: {
    flex: 1,
  },
  subtaskItem: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.22,
    elevation: 2,
  },
  subtaskContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  subtaskLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  subtaskText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  subtaskRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    color: "#999",
    marginRight: 5,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2A2A5A",
    borderRadius: 25,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});
