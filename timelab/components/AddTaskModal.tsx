"use client";

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { taskService } from "../lib/taskService";
import DateTimePicker from "@react-native-community/datetimepicker";

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onTaskAdded: () => void;
}

export default function AddTaskModal({
  visible,
  onClose,
  onTaskAdded,
}: AddTaskModalProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  // Date states
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [includeDates, setIncludeDates] = useState(false);

  const addSubtask = () => {
    setSubtasks([...subtasks, ""]);
  };

  const updateSubtask = (index: number, value: string) => {
    const updated = [...subtasks];
    updated[index] = value;
    setSubtasks(updated);
  };

  const removeSubtask = (index: number) => {
    if (subtasks.length > 1) {
      const updated = subtasks.filter((_, i) => i !== index);
      setSubtasks(updated);
    }
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setStartDate(selectedDate);
      // Auto-adjust end date if it's before start date
      if (endDate && selectedDate > endDate) {
        setEndDate(selectedDate);
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      // Ensure end date is not before start date
      if (startDate && selectedDate < startDate) {
        Alert.alert("Invalid Date", "End date cannot be before start date");
        return;
      }
      setEndDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSubmit = async () => {
    if (!taskTitle.trim()) {
      Alert.alert("Error", "Please enter a task title");
      return;
    }

    const validSubtasks = subtasks.filter((st) => st.trim() !== "");
    if (validSubtasks.length === 0) {
      Alert.alert("Error", "Please add at least one subtask");
      return;
    }

    if (includeDates && (!startDate || !endDate)) {
      Alert.alert("Error", "Please select both start and end dates");
      return;
    }

    setLoading(true);
    try {
      await taskService.addTask(
        taskTitle.trim(),
        validSubtasks,
        includeDates ? startDate : undefined,
        includeDates ? endDate : undefined
      );

      // Reset form
      setTaskTitle("");
      setSubtasks([""]);
      setStartDate(new Date());
      setEndDate(new Date());
      setIncludeDates(false);

      onTaskAdded();
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to create task");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Add New Task</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.label}>Task Title</Text>
            <TextInput
              style={styles.input}
              value={taskTitle}
              onChangeText={setTaskTitle}
              placeholder="Enter task title"
              placeholderTextColor="#999"
            />

            {/* Date Range Toggle */}
            <TouchableOpacity
              style={styles.dateToggle}
              onPress={() => setIncludeDates(!includeDates)}
            >
              <View style={styles.dateToggleContent}>
                <Ionicons
                  name={includeDates ? "checkbox" : "square-outline"}
                  size={20}
                  color={includeDates ? "#4361EE" : "#999"}
                />
                <Text style={styles.dateToggleText}>Set date range</Text>
              </View>
            </TouchableOpacity>

            {/* Date Pickers */}
            {includeDates && (
              <View style={styles.dateSection}>
                <View style={styles.dateRow}>
                  <View style={styles.dateColumn}>
                    <Text style={styles.dateLabel}>Start Date</Text>
                    <TouchableOpacity
                      style={styles.dateButton}
                      onPress={() => setShowStartDatePicker(true)}
                    >
                      <Text style={styles.dateButtonText}>
                        {startDate ? formatDate(startDate) : "Select date"}
                      </Text>
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.dateColumn}>
                    <Text style={styles.dateLabel}>End Date</Text>
                    <TouchableOpacity
                      style={styles.dateButton}
                      onPress={() => setShowEndDatePicker(true)}
                    >
                      <Text style={styles.dateButtonText}>
                        {endDate ? formatDate(endDate) : "Select date"}
                      </Text>
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            <Text style={styles.label}>Subtasks</Text>
            {subtasks.map((subtask, index) => (
              <View key={index} style={styles.subtaskRow}>
                <TextInput
                  style={[styles.input, styles.subtaskInput]}
                  value={subtask}
                  onChangeText={(value) => updateSubtask(index, value)}
                  placeholder={`Subtask ${index + 1}`}
                  placeholderTextColor="#999"
                />
                {subtasks.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeSubtask(index)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <TouchableOpacity
              onPress={addSubtask}
              style={styles.addSubtaskButton}
            >
              <Ionicons name="add" size={20} color="#4361EE" />
              <Text style={styles.addSubtaskText}>Add Subtask</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.createButton, loading && styles.disabledButton]}
              disabled={loading}
            >
              <Text style={styles.createText}>
                {loading ? "Creating..." : "Create Task"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Pickers */}
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
              minimumDate={new Date()}
            />
          )}

          {showEndDatePicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
              minimumDate={startDate || new Date()}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 16,
    width: "100%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
    maxHeight: 400,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },
  dateToggle: {
    marginTop: 16,
    marginBottom: 8,
  },
  dateToggleContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateToggleText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#374151",
  },
  dateSection: {
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#F9FAFB",
  },
  dateButtonText: {
    fontSize: 14,
    color: "#374151",
  },
  subtaskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  subtaskInput: {
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 8,
  },
  addSubtaskButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#4361EE",
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: "#F8FAFF",
  },
  addSubtaskText: {
    color: "#4361EE",
    fontWeight: "600",
    marginLeft: 4,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    marginRight: 8,
  },
  cancelText: {
    color: "#6B7280",
    fontWeight: "600",
  },
  createButton: {
    flex: 1,
    backgroundColor: "#4361EE",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 8,
  },
  createText: {
    color: "white",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
