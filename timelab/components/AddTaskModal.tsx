import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { taskService } from "../lib/taskService";

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

    setLoading(true);
    try {
      await taskService.addTask(taskTitle.trim(), validSubtasks);
      setTaskTitle("");
      setSubtasks([""]);
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
