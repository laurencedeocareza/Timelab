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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { goalService } from "../lib/goalService";
import { useRouter } from "expo-router";

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
  const router = useRouter();
  const [goalName, setGoalName] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGoalType, setSelectedGoalType] = useState("weekly");
  const [duration, setDuration] = useState(4);
  const [reminder, setReminder] = useState(false);
  const [goalItems, setGoalItems] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Functions for goal items
  const addGoalItem = () => {
    setGoalItems([...goalItems, ""]);
  };

  const updateGoalItem = (index: number, value: string) => {
    const updatedItems = [...goalItems];
    updatedItems[index] = value;
    setGoalItems(updatedItems);
  };

  const removeGoalItem = (index: number) => {
    if (goalItems.length > 1) {
      const updatedItems = goalItems.filter((_, i) => i !== index);
      setGoalItems(updatedItems);
    }
  };

  // Function to handle goal creation
  const handleCreateGoal = async () => {
    if (!goalName.trim()) {
      Alert.alert("Error", "Please enter a goal name");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    // Filter out empty goal items
    const validGoalItems = goalItems.filter((item) => item.trim() !== "");
    if (validGoalItems.length === 0) {
      Alert.alert("Error", "Please add at least one goal item");
      return;
    }

    try {
      setIsLoading(true);

      // Get current date info
      const now = new Date();
      const year = now.getFullYear();
      const month = now.toLocaleString("default", { month: "long" });
      const weekNumber = Math.ceil(now.getDate() / 7); // Simple week calculation

      // Generate a unique ID for the month
      const monthId = `${month.toLowerCase()}-${year}`;

      // Add the weekly goal
      await goalService.addWeeklyGoal(
        goalName,
        goalDescription || "No description provided",
        selectedCategory,
        monthId,
        month,
        year,
        weekNumber,
        validGoalItems
      );

      Alert.alert("Success", "Goal created successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error creating goal:", error);
      Alert.alert("Error", "Failed to create goal. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            onPress={() => router.back()}
            disabled={isLoading}
          >
            <Ionicons name="close-outline" size={28} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Goal</Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleCreateGoal}
            disabled={isLoading}
          >
            <Text
              style={[styles.saveButtonText, isLoading && { opacity: 0.5 }]}
            >
              {isLoading ? "Saving..." : "Save"}
            </Text>
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
              editable={!isLoading}
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
              editable={!isLoading}
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
                  disabled={isLoading}
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

          {/* Goal Items Section */}
          <View style={styles.formGroup}>
            <View style={styles.goalItemsHeader}>
              <Text style={styles.label}>Goal Items</Text>
              <TouchableOpacity
                style={styles.addItemButton}
                onPress={addGoalItem}
                disabled={isLoading}
              >
                <Ionicons name="add" size={20} color="#8B5CF6" />
              </TouchableOpacity>
            </View>
            {goalItems.map((item, index) => (
              <View key={index} style={styles.goalItemContainer}>
                <TextInput
                  style={[styles.input, styles.goalItemInput]}
                  placeholder={`Goal item ${index + 1}`}
                  value={item}
                  onChangeText={(value) => updateGoalItem(index, value)}
                  editable={!isLoading}
                />
                {goalItems.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeItemButton}
                    onPress={() => removeGoalItem(index)}
                    disabled={isLoading}
                  >
                    <Ionicons name="close" size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
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
                  disabled={isLoading}
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
                disabled={isLoading}
              >
                <Ionicons name="remove" size={24} color="#6B7280" />
              </TouchableOpacity>
              <View style={styles.durationValueContainer}>
                <Text style={styles.durationValue}>{duration}</Text>
              </View>
              <TouchableOpacity
                style={styles.durationButton}
                onPress={() => handleDurationChange(1)}
                disabled={isLoading}
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
              disabled={isLoading}
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
            style={[styles.createButton, isLoading && { opacity: 0.5 }]}
            onPress={handleCreateGoal}
            disabled={isLoading}
          >
            <Text style={styles.createButtonText}>
              {isLoading ? "CREATING GOAL..." : "CREATE GOAL"}
            </Text>
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
  goalItemsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  addItemButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  goalItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  goalItemInput: {
    flex: 1,
    marginRight: 10,
  },
  removeItemButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
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
