import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Button,
} from "react-native";

type Task = {
  id: string;
  name: string;
  duration: number; // in minutes
  priority: "Low" | "Medium" | "High";
};

export default function TimerCreationScreen() {
  // Calendar State
  const [currentMonth] = useState("November 2024");

  // Timer Method State
  const [methodName, setMethodName] = useState("Name of the method");
  const [isEditingName, setIsEditingName] = useState(false);

  // Task State
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", name: "Rest", duration: 3, priority: "High" },
  ]);

  // New Task Popup State
  const [showTaskPopup, setShowTaskPopup] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    name: "",
    duration: 0,
    priority: "Medium",
  });
  const [showDurationSelector, setShowDurationSelector] = useState(false);

  // Calendar Data (hardcoded for November 2024)
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const calendarDays = [
    [27, 28, 29, 30, 31, 1, 2],
    [3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29, 30],
  ];

  // Handlers
  const handleAddTask = () => {
    if (newTask.name.trim()) {
      setTasks([...tasks, { ...newTask, id: Date.now().toString() }]);
      setNewTask({ name: "", duration: 0, priority: "Medium" });
      setShowTaskPopup(false);
      setShowDurationSelector(false);
    }
  };

  const adjustDuration = (amount: number) => {
    setNewTask({
      ...newTask,
      duration: Math.max(0, newTask.duration + amount),
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Calendar Section */}
      <Text style={styles.sectionTitle}>{currentMonth}</Text>

      {/* Week Days Header */}
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day) => (
          <Text key={day} style={styles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Days Grid */}
      {calendarDays.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.calendarRow}>
          {week.map((day, dayIndex) => (
            <TouchableOpacity key={dayIndex} style={styles.calendarDay}>
              <Text
                style={day > 6 ? styles.currentMonthDay : styles.otherMonthDay}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <View style={styles.divider} />

      {/* Timer Method Section */}
      <View style={styles.section}>
        {isEditingName ? (
          <TextInput
            value={methodName}
            onChangeText={setMethodName}
            onBlur={() => setIsEditingName(false)}
            style={styles.methodNameInput}
            autoFocus
          />
        ) : (
          <TouchableOpacity onPress={() => setIsEditingName(true)}>
            <Text style={styles.methodNameText}>{methodName}</Text>
          </TouchableOpacity>
        )}

        {/* Add Task Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowTaskPopup(true)}
        >
          <Text style={styles.addButtonText}>+ Add Task</Text>
        </TouchableOpacity>

        {/* Tasks List */}
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskItem}>
            <Text style={styles.taskName}>{task.name}</Text>
            <Text style={styles.taskDetail}>{task.duration} mins</Text>
            <Text
              style={[
                styles.taskDetail,
                { color: task.priority === "High" ? "#e74c3c" : "#2ecc71" },
              ]}
            >
              {task.priority}
            </Text>
          </View>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/* Add Task Popup */}
      <Modal visible={showTaskPopup} transparent animationType="slide">
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Add New Task</Text>

            <TextInput
              placeholder="Task name"
              value={newTask.name}
              onChangeText={(text) => setNewTask({ ...newTask, name: text })}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.durationInput}
              onPress={() => setShowDurationSelector(true)}
            >
              <Text>{newTask.duration} mins</Text>
            </TouchableOpacity>

            {showDurationSelector && (
              <View style={styles.durationSelector}>
                <View style={styles.durationControls}>
                  <Button title="-" onPress={() => adjustDuration(-5)} />
                  <Text style={styles.durationText}>
                    {newTask.duration} mins
                  </Text>
                  <Button title="+" onPress={() => adjustDuration(5)} />
                </View>
                <Button
                  title="Set Duration"
                  onPress={() => setShowDurationSelector(false)}
                />
              </View>
            )}

            <View style={styles.priorityContainer}>
              {(["Low", "Medium", "High"] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.priorityButton,
                    newTask.priority === level && styles.selectedPriority,
                  ]}
                  onPress={() => setNewTask({ ...newTask, priority: level })}
                >
                  <Text>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.popupButtons}>
              <TouchableOpacity
                style={[styles.popupButton, styles.cancelButton]}
                onPress={() => {
                  setShowTaskPopup(false);
                  setShowDurationSelector(false);
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.popupButton, styles.confirmButton]}
                onPress={handleAddTask}
              >
                <Text style={styles.confirmButtonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  weekDaysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  weekDayText: {
    width: 40,
    textAlign: "center",
    fontWeight: "500",
    color: "#555",
  },
  calendarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  calendarDay: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  currentMonthDay: {
    fontSize: 16,
  },
  otherMonthDay: {
    fontSize: 16,
    color: "#999",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  methodNameText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  methodNameInput: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#3498db",
  },
  addButton: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#3498db",
    fontWeight: "500",
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  taskName: {
    flex: 2,
    fontWeight: "500",
  },
  taskDetail: {
    flex: 1,
    textAlign: "right",
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: "#3498db",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  durationInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  durationSelector: {
    marginBottom: 16,
    alignItems: "center",
  },
  durationControls: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  durationText: {
    marginHorizontal: 20,
    fontSize: 18,
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  priorityButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  selectedPriority: {
    borderColor: "#3498db",
    backgroundColor: "#ebf5fb",
  },
  popupButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  popupButton: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  confirmButton: {
    backgroundColor: "#3498db",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
