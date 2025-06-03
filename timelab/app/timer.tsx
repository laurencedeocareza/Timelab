"use client";

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Alert,
  FlatList,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { taskService } from "../lib/taskService";
import {
  customTimerService,
  type CustomSession,
} from "../lib/customTimerService";
import Svg, { Circle } from "react-native-svg";

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
}

const techniques = {
  pomodoro: { work: 25 * 60, rest: 5 * 60, name: "Pomodoro" },
  timeboxing: { work: 30 * 60, rest: 10 * 60, name: "Timeboxing" },
  flowtime: { work: 45 * 60, rest: 15 * 60, name: "Flowtime" },
  custom: { work: 30 * 60, rest: 10 * 60, name: "Custom" },
};

type TechniqueType = keyof typeof techniques | "custom";

export default function TimerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const taskId = params.taskId?.toString() || "";
  const taskTitle = params.taskTitle?.toString() || "";
  const technique =
    (params.technique?.toString() as TechniqueType) || "pomodoro";
  const customSessionId = params.customSessionId?.toString();
  const subtasksParam = params.subtasks?.toString() || "[]";

  // Custom session states
  const [customSession, setCustomSession] = useState<CustomSession | null>(
    null
  );
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState(0);
  const [isCustomMode, setIsCustomMode] = useState(technique === "custom");

  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Initialize component
  useEffect(() => {
    const initializeTimer = async () => {
      try {
        // Parse subtasks
        const parsedSubtasks = JSON.parse(subtasksParam);
        setSubtasks(parsedSubtasks);

        // Handle custom session
        if (technique === "custom" && customSessionId) {
          const sessions = await customTimerService.getUserCustomSessions();
          const session = sessions.find((s) => s.id === customSessionId);

          if (session) {
            setCustomSession(session);
            setIsCustomMode(true);
            setTimeLeft(session.intervals[0]?.totalSeconds || 300);
          } else {
            Alert.alert("Error", "Custom session not found");
            router.back();
          }
        } else {
          // Standard technique
          setIsCustomMode(false);
          setIsWorkTime(true);
          setTimeLeft(techniques[technique as keyof typeof techniques].work);
        }
      } catch (error) {
        console.error("Error initializing timer:", error);
      }
    };

    initializeTimer();
  }, [technique, customSessionId, subtasksParam]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setTotalTimeSpent((prev) => prev + 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Progress animation
  useEffect(() => {
    let currentDuration;

    if (isCustomMode && customSession) {
      currentDuration =
        customSession.intervals[currentIntervalIndex]?.totalSeconds || 300;
    } else {
      const standardTechnique =
        techniques[technique as keyof typeof techniques];
      currentDuration = isWorkTime
        ? standardTechnique.work
        : standardTechnique.rest;
    }

    const progress = 1 - timeLeft / currentDuration;

    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [
    timeLeft,
    isWorkTime,
    technique,
    isCustomMode,
    customSession,
    currentIntervalIndex,
  ]);

  // Slide animation for work/rest transition
  // useEffect(() => {
  //   Animated.timing(slideAnim, {
  //     toValue: isWorkTime ? 0 : 1,
  //     duration: 500,
  //     useNativeDriver: true,
  //   }).start();
  // }, [isWorkTime]);

  const handleTimerComplete = () => {
    setIsRunning(false);

    if (isCustomMode && customSession) {
      // Handle custom session completion
      const nextIndex = currentIntervalIndex + 1;

      if (nextIndex < customSession.intervals.length) {
        // Move to next interval
        setCurrentIntervalIndex(nextIndex);
        setTimeLeft(customSession.intervals[nextIndex].totalSeconds);
      } else {
        // All intervals completed, restart from beginning and increment cycle
        setCurrentIntervalIndex(0);
        setTimeLeft(customSession.intervals[0].totalSeconds);
        setCycleCount((prev) => prev + 1);
      }
    } else {
      // Handle standard technique
      const standardTechnique =
        techniques[technique as keyof typeof techniques];

      if (isWorkTime) {
        // Work session completed, start rest
        setIsWorkTime(false);
        setTimeLeft(standardTechnique.rest);
      } else {
        // Rest completed, start work
        setIsWorkTime(true);
        setTimeLeft(standardTechnique.work);
        setCycleCount((prev) => prev + 1);
      }

      // Check if 1 hour threshold is met
      if (totalTimeSpent >= 3600) {
        handleFinish();
      }
    }
  };

  const handleFinish = async () => {
    try {
      // Update completed subtasks in Firebase
      const completedSubtasks = subtasks.filter((st) => st.completed);

      for (const subtask of completedSubtasks) {
        await taskService.updateSubtaskCompletion(taskId, subtask.id, true);
      }

      Alert.alert(
        "Session Complete",
        `You completed ${completedSubtasks.length}/${subtasks.length} subtasks in this session.`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("Error updating subtasks:", error);
      router.back();
    }
  };

  const toggleSubtask = (subtaskId: string) => {
    setSubtasks((prev) =>
      prev.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const getCurrentIntervalName = () => {
    if (isCustomMode && customSession) {
      return customSession.intervals[currentIntervalIndex]?.label || "Custom";
    }
    return isWorkTime ? "Work" : "Rest";
  };

  const getTechniqueName = () => {
    if (isCustomMode && customSession) {
      return customSession.name;
    }
    return techniques[technique as keyof typeof techniques].name;
  };

  const getCurrentDuration = () => {
    if (isCustomMode && customSession) {
      return customSession.intervals[currentIntervalIndex]?.totalSeconds || 300;
    }
    const standardTechnique = techniques[technique as keyof typeof techniques];
    return isWorkTime ? standardTechnique.work : standardTechnique.rest;
  };

  const CircularProgress = () => {
    const size = 200;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    const currentDuration = getCurrentDuration();
    const progress = 1 - timeLeft / currentDuration;
    const strokeDashoffset = circumference * (1 - progress);

    // Get color based on mode
    const getColor = () => {
      if (isCustomMode) {
        return "#4361EE"; // Custom color
      }
      return isWorkTime ? "#EF4444" : "#10B981";
    };

    return (
      <View style={styles.progressContainer}>
        <Svg width={size} height={size} style={styles.progressSvg}>
          {/* Background circle */}
          <Circle
            stroke="#E5E7EB"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <Circle
            stroke={getColor()}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.timerContent}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          <Animated.View
            style={[
              styles.statusContainer,
              {
                transform: [
                  {
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -50],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={[styles.statusText, { color: getColor() }]}>
              {getCurrentIntervalName()}
            </Text>
          </Animated.View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#2A2A5A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{taskTitle}</Text>
        <TouchableOpacity onPress={handleFinish} style={styles.finishButton}>
          <Text style={styles.finishText}>Finish</Text>
        </TouchableOpacity>
      </View>

      {/* Timer Display */}
      <View style={styles.timerSection}>
        <CircularProgress />

        {/* Session Info */}
        <View style={styles.sessionInfo}>
          <Text style={styles.techniqueText}>{getTechniqueName()}</Text>
          <Text style={styles.totalTimeText}>
            Total: {formatTotalTime(totalTimeSpent)}
          </Text>
          <Text style={styles.cycleText}>Cycles: {cycleCount}</Text>
        </View>
      </View>

      {/* Control Button */}
      <TouchableOpacity
        style={[
          styles.controlButton,
          { backgroundColor: isRunning ? "#EF4444" : "#10B981" },
        ]}
        onPress={() => setIsRunning(!isRunning)}
      >
        <Ionicons
          name={isRunning ? "pause" : "play"}
          size={24}
          color="white"
          style={styles.controlIcon}
        />
        <Text style={styles.controlText}>{isRunning ? "PAUSE" : "START"}</Text>
      </TouchableOpacity>

      {/* Custom Session Intervals (if custom mode) */}
      {isCustomMode && customSession && (
        <View style={styles.intervalsSection}>
          <Text style={styles.intervalsTitle}>Session Timeline</Text>
          <FlatList
            data={customSession.intervals}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.intervalCard,
                  {
                    backgroundColor:
                      index === currentIntervalIndex
                        ? "#4361EE"
                        : index < currentIntervalIndex
                        ? "#10B981"
                        : "#E5E7EB",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.intervalLabel,
                    {
                      color:
                        index <= currentIntervalIndex ? "white" : "#6B7280",
                    },
                  ]}
                >
                  {item.label}
                </Text>
                <Text
                  style={[
                    styles.intervalTime,
                    {
                      color:
                        index <= currentIntervalIndex ? "white" : "#6B7280",
                    },
                  ]}
                >
                  {formatTime(item.totalSeconds)}
                </Text>
              </View>
            )}
            style={styles.intervalsList}
          />
        </View>
      )}

      {/* Subtasks */}
      <View style={styles.subtasksSection}>
        <Text style={styles.subtasksTitle}>
          Subtasks ({subtasks.filter((st) => st.completed).length}/
          {subtasks.length})
        </Text>
        <FlatList
          data={[
            ...subtasks.filter((item) => !item.completed),
            ...subtasks.filter((item) => item.completed),
          ]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.subtaskItem}
              onPress={() => toggleSubtask(item.id)}
            >
              <View
                style={[
                  styles.subtaskCheckbox,
                  { backgroundColor: item.completed ? "#10B981" : "#E5E7EB" },
                ]}
              >
                {item.completed && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <View style={styles.subtaskContent}>
                <Text
                  style={[
                    styles.subtaskText,
                    item.completed && styles.completedSubtaskText,
                  ]}
                >
                  {item.title}
                </Text>
                <View
                  style={[
                    styles.priorityBadge,
                    {
                      backgroundColor:
                        item.priority === "High"
                          ? "#EF4444"
                          : item.priority === "Medium"
                          ? "#F59E0B"
                          : "#6B7280",
                    },
                  ]}
                >
                  <Text style={styles.priorityBadgeText}>{item.priority}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          style={styles.subtasksList}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2A2A5A",
    flex: 1,
    textAlign: "center",
  },
  finishButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  finishText: {
    color: "white",
    fontWeight: "600",
  },
  timerSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  progressContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  progressSvg: {
    transform: [{ rotate: "-90deg" }],
  },
  timerContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 36,
    fontWeight: "300",
    color: "#2A2A5A",
    marginBottom: 8,
  },
  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600",
  },
  sessionInfo: {
    alignItems: "center",
    marginTop: 20,
  },
  techniqueText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2A2A5A",
    marginBottom: 4,
  },
  totalTimeText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  cycleText: {
    fontSize: 14,
    color: "#6B7280",
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 20,
  },
  controlIcon: {
    marginRight: 8,
  },
  controlText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  intervalsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  intervalsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2A2A5A",
    marginBottom: 12,
  },
  intervalsList: {
    flexGrow: 0,
  },
  intervalCard: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 80,
    alignItems: "center",
  },
  intervalLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
  },
  intervalTime: {
    fontSize: 10,
    fontWeight: "400",
  },
  subtasksSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtasksTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2A2A5A",
    marginBottom: 12,
  },
  subtasksList: {
    flex: 1,
  },
  subtaskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  subtaskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  subtaskText: {
    fontSize: 16,
    color: "#2A2A5A",
    flex: 1,
  },
  completedSubtaskText: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  subtaskContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
});
