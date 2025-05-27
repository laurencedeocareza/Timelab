"use client";

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define types
type RootStackParamList = {
  Dashboard: undefined;
  GoalsPage: undefined;
  NewGoal: undefined;
};

type NewGoalProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "NewGoal">;
};

type Category = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

type GoalType = {
  id: string;
  name: string;
};

// Goal categories
const categories: Category[] = [
  {
    id: "SPORTING",
    name: "Sporting",
    icon: "fitness-outline",
    color: "#3B82F6",
  },
  { id: "ACADEMIC", name: "Academic", icon: "book-outline", color: "#0D9488" },
  { id: "HEALTH", name: "Health", icon: "heart-outline", color: "#8B5CF6" },
  { id: "FINANCE", name: "Finance", icon: "cash-outline", color: "#F59E0B" },
];

// Goal types
const goalTypes: GoalType[] = [
  { id: "weekly", name: "Weekly" },
  { id: "daily", name: "Daily" },
  { id: "onetime", name: "One-time" },
];

const NewGoal = ({ navigation }: NewGoalProps) => {
  const [goalName, setGoalName] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGoalType, setSelectedGoalType] = useState("weekly");
  const [duration, setDuration] = useState(4);
  const [reminder, setReminder] = useState(false);

  // Function to handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Function to handle goal type selection
  const handleGoalTypeSelect = (typeId: string) => {
    setSelectedGoalType(typeId);
  };

  // Function to handle duration change
  const handleDurationChange = (value: number) => {
    const newDuration = Math.max(1, Math.min(52, duration + value));
    setDuration(newDuration);
  };

  // Function to handle goal creation
  const handleCreateGoal = () => {
    // Here you would typically save the goal data
    // For now, we'll just navigate back
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close-outline" size={28} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Goal</Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleCreateGoal}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Goal Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Goal Name</Text>
            <TextInput
              style={styles.input}
              placeholder="What do you want to achieve?"
              value={goalName}
              onChangeText={setGoalName}
            />
          </View>

          {/* Goal Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add more details about your goal"
              multiline
              numberOfLines={4}
              value={goalDescription}
              onChangeText={setGoalDescription}
            />
          </View>

          {/* Category Selection */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    selectedCategory === category.id &&
                      styles.selectedCategoryItem,
                    selectedCategory === category.id && {
                      borderColor: category.color,
                    },
                  ]}
                  onPress={() => handleCategorySelect(category.id)}
                >
                  <Ionicons
                    name={category.icon}
                    size={24}
                    color={
                      selectedCategory === category.id
                        ? category.color
                        : "#6B7280"
                    }
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category.id &&
                        styles.selectedCategoryText,
                      selectedCategory === category.id && {
                        color: category.color,
                      },
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Goal Type */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Goal Type</Text>
            <View style={styles.goalTypeContainer}>
              {goalTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.goalTypeItem,
                    selectedGoalType === type.id && styles.selectedGoalTypeItem,
                  ]}
                  onPress={() => handleGoalTypeSelect(type.id)}
                >
                  <Text
                    style={[
                      styles.goalTypeText,
                      selectedGoalType === type.id &&
                        styles.selectedGoalTypeText,
                    ]}
                  >
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Duration */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Duration (
              {selectedGoalType === "weekly"
                ? "weeks"
                : selectedGoalType === "daily"
                ? "days"
                : "days"}
              )
            </Text>
            <View style={styles.durationContainer}>
              <TouchableOpacity
                style={styles.durationButton}
                onPress={() => handleDurationChange(-1)}
              >
                <Ionicons name="remove" size={24} color="#6B7280" />
              </TouchableOpacity>
              <View style={styles.durationValueContainer}>
                <Text style={styles.durationValue}>{duration}</Text>
              </View>
              <TouchableOpacity
                style={styles.durationButton}
                onPress={() => handleDurationChange(1)}
              >
                <Ionicons name="add" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Reminder */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Reminder</Text>
            <TouchableOpacity
              style={styles.reminderButton}
              onPress={() => setReminder(!reminder)}
            >
              <Text style={styles.reminderButtonText}>
                {reminder ? "Reminder set" : "Set a reminder"}
              </Text>
              <Ionicons
                name={reminder ? "alarm" : "alarm-outline"}
                size={24}
                color={reminder ? "#8B5CF6" : "#6B7280"}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Create Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateGoal}
          >
            <Text style={styles.createButtonText}>CREATE GOAL</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  saveButton: {
    padding: 5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1F2937",
    backgroundColor: "#F9FAFB",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: "#F9FAFB",
  },
  selectedCategoryItem: {
    backgroundColor: "#F3E8FF",
    borderWidth: 2,
  },
  categoryText: {
    marginTop: 8,
    fontSize: 12,
    color: "#6B7280",
  },
  selectedCategoryText: {
    fontWeight: "600",
  },
  goalTypeContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
  },
  goalTypeItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
  },
  selectedGoalTypeItem: {
    backgroundColor: "#8B5CF6",
  },
  goalTypeText: {
    fontSize: 14,
    color: "#6B7280",
  },
  selectedGoalTypeText: {
    color: "white",
    fontWeight: "600",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
  },
  durationButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  durationValueContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  durationValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  reminderButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#F9FAFB",
  },
  reminderButtonText: {
    fontSize: 16,
    color: "#6B7280",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  createButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 30,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NewGoal;
