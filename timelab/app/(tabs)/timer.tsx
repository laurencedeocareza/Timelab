import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Animate progress
  useEffect(() => {
    const progress = 1 - timeLeft / (25 * 60);
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Pomodoro</Text>

      {/* Timer Display - Using View instead of SVG */}
      <View style={styles.timerContainer}>
        <View style={styles.circleBackground} />
        <Animated.View
          style={[
            styles.circleProgress,
            {
              transform: [
                {
                  rotate: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        />
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </View>

      {/* Tasks Section (unchanged) */}
      <Text style={styles.sectionTitle}>Tasks</Text>

      <View style={styles.taskList}>
        <View style={styles.taskItem}>
          <Text style={styles.taskText}>Design review</Text>
          <View style={[styles.priorityBadge, styles.highPriority]}>
            <Text style={styles.priorityText}>High</Text>
          </View>
        </View>
        <View style={styles.taskItem}>
          <Text style={styles.taskText}>Code refactor</Text>
          <View style={[styles.priorityBadge, styles.mediumPriority]}>
            <Text style={styles.priorityText}>Medium</Text>
          </View>
        </View>
        <View style={styles.taskItem}>
          <Text style={styles.taskText}>Team meeting</Text>
          <View style={[styles.priorityBadge, styles.lowPriority]}>
            <Text style={styles.priorityText}>Low</Text>
          </View>
        </View>
      </View>

      {/* Control Button */}
      <TouchableOpacity
        style={styles.controlButton}
        onPress={() => setIsRunning(!isRunning)}
      >
        <Text style={styles.controlButtonText}>
          {isRunning ? "PAUSE" : "START"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const CIRCLE_SIZE = 200;
const CIRCLE_THICKNESS = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 32,
    textAlign: "center",
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    height: CIRCLE_SIZE,
  },
  circleBackground: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: CIRCLE_THICKNESS,
    borderColor: "#E5E7EB",
    position: "absolute",
  },
  circleProgress: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: CIRCLE_THICKNESS,
    borderColor: "#3B82F6",
    position: "absolute",
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: "#3B82F6",
    borderTopColor: "#3B82F6",
    transform: [{ rotate: "0deg" }],
  },
  timerText: {
    fontSize: 36,
    fontWeight: "300",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#374151",
  },
  taskList: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  taskText: {
    fontSize: 16,
    color: "#111827",
  },
  priorityBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  highPriority: {
    backgroundColor: "#FEE2E2",
  },
  mediumPriority: {
    backgroundColor: "#FEF3C7",
  },
  lowPriority: {
    backgroundColor: "#D1FAE5",
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
  },
  controlButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 32,
  },
  controlButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
