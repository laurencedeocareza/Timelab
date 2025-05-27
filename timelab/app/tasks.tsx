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
import { customTimerService } from "../lib/customTimerService";

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
    name: "Flowtime",
    icon: "water",
    color: "#6A5ACD",
  },
  custom: {
    name: "Custom",
    icon: "settings-outline",
    color: "#F59E0B",
  },
};

export default function TaskDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskId = params.id?.toString() || "";
  const [currentPriority, setCurrentPriority] = useState("Medium");
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [customSessions, setCustomSessions] = useState<any[]>([]);
  const [selectedCustomSession, setSelectedCustomSession] = useState<
    string | null
  >(null);
  const [showCustomSelector, setShowCustomSelector] = useState(false);

  // State for Firebase data
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTechnique, setCurrentTechnique] =
    useState<keyof typeof techniques>("pomodoro");

  // Load task data from Firebase
  useEffect(() => {
    const loadCustomSessions = async () => {
      try {
        const sessions = await customTimerService.getUserCustomSessions();
        setCustomSessions(sessions);
      } catch (error) {
        console.error("Error loading custom sessions:", error);
      }
    };

    loadCustomSessions();

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
  const handleSubtaskPriorityChange = async (
    subtaskId: string,
    priority: "Low" | "Medium" | "High"
  ) => {
    try {
      await taskService.updateSubtaskPriority(taskId, subtaskId, priority);
      // Reload task data
      const tasks = await taskService.getUserTasks();
      const updatedTask = tasks.find((t) => t.id === taskId);
      setTaskDetails(updatedTask || null);
      setEditingSubtaskId(null);
    } catch (error) {
      console.error("Error updating subtask priority:", error);
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
        {/* Priority selector */}
        {/* <View style={styles.priorityContainer}>
          <Text style={styles.sectionTitle}>Priority Level</Text>
          <View style={styles.priorityRow}>
            {["Low", "Medium", "High"].map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.priorityButton,
                  currentPriority === priority && styles.selectedPriority,
                ]}
                onPress={() => setCurrentPriority(priority)}
              >
                <Text
                  style={[
                    styles.priorityText,
                    currentPriority === priority && styles.selectedPriorityText,
                  ]}
                >
                  {priority}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View> */}
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
                onPress={() => {
                  setCurrentTechnique(key as keyof typeof techniques);
                  if (key === "custom") {
                    setShowCustomSelector(true);
                  }
                }}
              >
                <Ionicons
                  name={tech.icon as any}
                  size={24}
                  color={tech.color}
                />
                <Text style={[styles.techniqueName, { color: tech.color }]}>
                  {tech.name}
                </Text>
              </TouchableOpacity>
            ))}
            {/* Custom Session Selector */}
            {showCustomSelector && (
              <View style={styles.customSelector}>
                <Text style={styles.customSelectorTitle}>
                  Select Custom Session:
                </Text>
                {customSessions.map((session) => (
                  <TouchableOpacity
                    key={session.id}
                    style={[
                      styles.customSessionOption,
                      selectedCustomSession === session.id &&
                        styles.selectedCustomSession,
                    ]}
                    onPress={() => {
                      setSelectedCustomSession(session.id);
                      setShowCustomSelector(false);
                    }}
                  >
                    <Text style={styles.customSessionName}>{session.name}</Text>
                    <Text style={styles.customSessionDetails}>
                      {session.intervals.length} intervals
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Subtasks list */}
        <View style={styles.subtasksContainer}>
          <Text style={styles.sectionTitle}>Subtasks</Text>
          <FlatList
            data={[
              ...taskDetails.subtasks.filter((item) => !item.completed),
              ...taskDetails.subtasks.filter((item) => item.completed),
            ]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.subtaskItem}>
                <TouchableOpacity
                  style={styles.subtaskContent}
                  onPress={() => handleSubtaskPress(item)}
                >
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
                </TouchableOpacity>

                {/* Priority selector for each subtask */}
                <View style={styles.subtaskPriorityContainer}>
                  <Text style={styles.subtaskPriorityLabel}>Priority:</Text>
                  <View style={styles.subtaskPriorityButtons}>
                    {["Low", "Medium", "High"].map((priority) => (
                      <TouchableOpacity
                        key={priority}
                        style={[
                          styles.subtaskPriorityButton,
                          (item as any).priority === priority &&
                            styles.selectedSubtaskPriority,
                        ]}
                        onPress={() =>
                          handleSubtaskPriorityChange(
                            item.id,
                            priority as "Low" | "Medium" | "High"
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.subtaskPriorityText,
                            (item as any).priority === priority &&
                              styles.selectedSubtaskPriorityText,
                          ]}
                        >
                          {priority}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
            style={styles.subtasksList}
          />
        </View>

        {/* Start focused work button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            router.push({
              pathname: "/timer",
              params: {
                taskId: taskDetails.id,
                taskTitle: taskDetails.title,
                technique: currentTechnique,
                customSessionId: selectedCustomSession,
                subtasks: JSON.stringify(taskDetails.subtasks),
              },
            });
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
  priorityContainer: {
    marginBottom: 20,
  },
  priorityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  selectedPriority: {
    backgroundColor: "#2A2A5A",
    borderColor: "#2A2A5A",
  },
  priorityText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2A2A5A",
  },
  selectedPriorityText: {
    color: "white",
  },
  subtaskPriorityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  subtaskPriorityLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  subtaskPriorityButtons: {
    flexDirection: "row",
  },
  subtaskPriorityButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 4,
    backgroundColor: "#F3F4F6",
  },
  selectedSubtaskPriority: {
    backgroundColor: "#2A2A5A",
  },
  subtaskPriorityText: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "500",
  },
  selectedSubtaskPriorityText: {
    color: "white",
  },
  customSelector: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  customSelectorTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2A2A5A",
    marginBottom: 8,
  },
  customSessionOption: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#F9FAFB",
  },
  selectedCustomSession: {
    backgroundColor: "#F0F4FF",
    borderWidth: 1,
    borderColor: "#4361EE",
  },
  customSessionName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2A2A5A",
  },
  customSessionDetails: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});
