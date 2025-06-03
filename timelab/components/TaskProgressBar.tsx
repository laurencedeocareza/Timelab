import type React from "react";
import { View, Text, StyleSheet } from "react-native";

interface TaskProgressBarProps {
  task: {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    progress: number;
    color?: string;
  };
  currentDate: Date;
  calendarStartDate: Date;
  calendarEndDate: Date;
}

const TaskProgressBar: React.FC<TaskProgressBarProps> = ({
  task,
  currentDate,
  calendarStartDate,
  calendarEndDate,
}) => {
  // Calculate position and width based on dates
  const totalCalendarDays = Math.ceil(
    (calendarEndDate.getTime() - calendarStartDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const taskStartDays = Math.max(
    0,
    Math.ceil(
      (task.startDate.getTime() - calendarStartDate.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const taskEndDays = Math.min(
    totalCalendarDays,
    Math.ceil(
      (task.endDate.getTime() - calendarStartDate.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const taskDuration = taskEndDays - taskStartDays;

  // Calculate percentages for positioning
  const leftPercentage = (taskStartDays / totalCalendarDays) * 100;
  const widthPercentage = (taskDuration / totalCalendarDays) * 100;

  // Don't render if task is outside calendar range
  if (taskEndDays <= 0 || taskStartDays >= totalCalendarDays) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.taskTitle} numberOfLines={1}>
        {task.title}
      </Text>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressBar,
            {
              left: `${leftPercentage}%`,
              width: `${widthPercentage}%`,
              backgroundColor: task.color || "#4361EE",
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${task.progress}%`,
                backgroundColor: task.color || "#4361EE",
                opacity: 0.8,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
    position: "relative",
  },
  progressBar: {
    position: "absolute",
    height: 8,
    borderRadius: 4,
    opacity: 0.3,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
});

export default TaskProgressBar;
