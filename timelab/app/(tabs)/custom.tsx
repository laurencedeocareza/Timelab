import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  customTimerService,
  TimeInterval,
  CustomSession,
} from "../../lib/customTimerService";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function CustomTimerScreen() {
  const router = useRouter();

  const [sessionName, setSessionName] = useState("");
  const [intervals, setIntervals] = useState<Omit<TimeInterval, "id">[]>([
    { label: "Work", hours: 0, minutes: 25, seconds: 0, totalSeconds: 1500 },
  ]);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    undefined
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customSessions, setCustomSessions] = useState<CustomSession[]>([]);
  const [loading, setLoading] = useState(false);

  // Load existing custom sessions
  useEffect(() => {
    const unsubscribe = customTimerService.subscribeToUserCustomSessions(
      (sessions) => {
        setCustomSessions(sessions);
      }
    );

    return () => unsubscribe();
  }, []);

  const addInterval = () => {
    setIntervals([
      ...intervals,
      {
        label: `Interval ${intervals.length + 1}`,
        hours: 0,
        minutes: 5,
        seconds: 0,
        totalSeconds: 300,
      },
    ]);
  };

  const removeInterval = (index: number) => {
    if (intervals.length > 1) {
      setIntervals(intervals.filter((_, i) => i !== index));
    }
  };

  const updateInterval = (
    index: number,
    field: keyof Omit<TimeInterval, "id" | "totalSeconds">,
    value: string | number
  ) => {
    const updatedIntervals = [...intervals];
    updatedIntervals[index] = { ...updatedIntervals[index], [field]: value };

    // Recalculate total seconds
    const interval = updatedIntervals[index];
    interval.totalSeconds =
      interval.hours * 3600 + interval.minutes * 60 + interval.seconds;

    setIntervals(updatedIntervals);
  };

  const handleSaveSession = async () => {
    if (!sessionName.trim()) {
      Alert.alert("Error", "Please enter a session name");
      return;
    }

    if (intervals.length === 0) {
      Alert.alert("Error", "Please add at least one interval");
      return;
    }

    setLoading(true);
    try {
      await customTimerService.addCustomSession(
        sessionName.trim(),
        intervals,
        scheduledDate
      );

      Alert.alert("Success", "Custom session created successfully!");
      setSessionName("");
      setIntervals([
        {
          label: "Work",
          hours: 0,
          minutes: 25,
          seconds: 0,
          totalSeconds: 1500,
        },
      ]);
      setScheduledDate(undefined);
    } catch (error) {
      Alert.alert("Error", "Failed to create custom session");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSession = (session: CustomSession) => {
    router.push({
      pathname: "../edit-custom-session",
      params: { sessionId: session.id },
    });
  };

  const handleDeleteSession = async (sessionId: string) => {
    Alert.alert(
      "Delete Session",
      "Are you sure you want to delete this custom session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await customTimerService.deleteCustomSession(sessionId);
            } catch (error) {
              Alert.alert("Error", "Failed to delete session");
            }
          },
        },
      ]
    );
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#2A2A5A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Custom Timer</Text>
        </View>

        {/* Session Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Name</Text>
          <TextInput
            style={styles.input}
            value={sessionName}
            onChangeText={setSessionName}
            placeholder="Enter session name"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Schedule Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule Date (Optional)</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {scheduledDate ? scheduledDate.toDateString() : "Select Date"}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={scheduledDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setScheduledDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        {/* Time Intervals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Time Intervals</Text>
            <TouchableOpacity onPress={addInterval} style={styles.addButton}>
              <Ionicons name="add" size={20} color="#4361EE" />
            </TouchableOpacity>
          </View>

          {intervals.map((interval, index) => (
            <View key={index} style={styles.intervalCard}>
              <View style={styles.intervalHeader}>
                <TextInput
                  style={styles.intervalLabel}
                  value={interval.label}
                  onChangeText={(text) => updateInterval(index, "label", text)}
                  placeholder="Interval label"
                />
                {intervals.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeInterval(index)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.timeInputs}>
                <View style={styles.timeInput}>
                  <Text style={styles.timeLabel}>Hours</Text>
                  <TextInput
                    style={styles.timeField}
                    value={interval.hours.toString()}
                    onChangeText={(text) =>
                      updateInterval(index, "hours", parseInt(text) || 0)
                    }
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
                <View style={styles.timeInput}>
                  <Text style={styles.timeLabel}>Minutes</Text>
                  <TextInput
                    style={styles.timeField}
                    value={interval.minutes.toString()}
                    onChangeText={(text) =>
                      updateInterval(index, "minutes", parseInt(text) || 0)
                    }
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
                <View style={styles.timeInput}>
                  <Text style={styles.timeLabel}>Seconds</Text>
                  <TextInput
                    style={styles.timeField}
                    value={interval.seconds.toString()}
                    onChangeText={(text) =>
                      updateInterval(index, "seconds", parseInt(text) || 0)
                    }
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
              </View>

              <Text style={styles.intervalDuration}>
                Duration: {formatDuration(interval.totalSeconds)}
              </Text>
            </View>
          ))}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSaveSession}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Creating..." : "Create Custom Session"}
          </Text>
        </TouchableOpacity>

        {/* Existing Custom Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Custom Sessions</Text>
          {customSessions.length === 0 ? (
            <Text style={styles.emptyText}>No custom sessions yet</Text>
          ) : (
            customSessions.map((session) => (
              <View key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionName}>{session.name}</Text>
                  <Text style={styles.sessionDetails}>
                    {session.intervals.length} intervals •{" "}
                    {formatDuration(session.sessionDuration)}
                  </Text>
                  {session.scheduledDate && (
                    <Text style={styles.sessionDate}>
                      Scheduled:{" "}
                      {new Date(session.scheduledDate).toDateString()}
                    </Text>
                  )}
                </View>
                <View style={styles.sessionActions}>
                  <TouchableOpacity
                    onPress={() => handleEditSession(session)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="pencil" size={18} color="#4361EE" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteSession(session.id)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2A2A5A",
    marginLeft: 10,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2A2A5A",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dateButton: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#374151",
  },
  addButton: {
    backgroundColor: "#F0F4FF",
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  intervalCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  intervalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  intervalLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#2A2A5A",
  },
  removeButton: {
    padding: 4,
  },
  timeInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  timeInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  timeLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    textAlign: "center",
  },
  timeField: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
    textAlign: "center",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  intervalDuration: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: "#4361EE",
    borderRadius: 25,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 16,
    marginTop: 20,
  },
  sessionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2A2A5A",
    marginBottom: 4,
  },
  sessionDetails: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  sessionDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  sessionActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});
