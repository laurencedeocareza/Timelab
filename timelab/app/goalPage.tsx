"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  goalService,
  type WeeklyGoal,
  type GoalItem,
} from "../lib/goalService";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// Define types
type RootStackParamList = {
  Dashboard: undefined;
  GoalsPage: undefined;
  NewGoal: undefined;
};

type GoalsPageProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "GoalsPage">;
};

type MonthlyGoal = {
  id: string;
  month: string;
  year: number;
  goals: number;
  color: string;
};

// Add Goal Item Modal Component
interface AddGoalItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (title: string) => void;
}

const AddGoalItemModal = ({
  visible,
  onClose,
  onAdd,
}: AddGoalItemModalProps) => {
  const [itemTitle, setItemTitle] = useState("");

  const handleAdd = () => {
    if (itemTitle.trim()) {
      onAdd(itemTitle.trim());
      setItemTitle("");
      onClose();
    } else {
      Alert.alert("Error", "Please enter a goal item title");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Goal Item</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter goal item title"
            value={itemTitle}
            onChangeText={setItemTitle}
            autoFocus
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalPrimaryButton]}
              onPress={handleAdd}
            >
              <Text style={styles.modalPrimaryButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const GoalsPage = ({ navigation }: GoalsPageProps) => {
  const router = useRouter();
  // Firebase state
  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoal[]>([]);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);
  const [loading, setLoading] = useState(true);

  // Navigation state
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  // Modal state
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [currentGoalId, setCurrentGoalId] = useState<string | null>(null);

  // Load data from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load monthly stats
        const monthStats = await goalService.getMonthlyGoalStats();
        setMonthlyGoals(monthStats);

        // Load weekly goals
        const goals = await goalService.getUserWeeklyGoals();
        setWeeklyGoals(goals);
      } catch (error) {
        console.error("Error loading goals:", error);
        Alert.alert("Error", "Failed to load goals");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Set up real-time listener
    const unsubscribe = goalService.subscribeToWeeklyGoals((goals) => {
      setWeeklyGoals(goals);
    });

    return () => unsubscribe();
  }, []);

  // Function to handle month selection
  const handleMonthSelect = async (monthId: string) => {
    setSelectedMonth(monthId);
    setSelectedWeek(null);

    try {
      const goals = await goalService.getWeeklyGoalsByMonth(monthId);
      setWeeklyGoals(goals);
    } catch (error) {
      console.error("Error loading weekly goals:", error);
    }
  };

  // Function to handle week selection
  const handleWeekSelect = (weekId: string) => {
    setSelectedWeek(weekId);
  };

  // Function to go back to month view
  const handleBackToMonths = () => {
    setSelectedMonth(null);
    setSelectedWeek(null);
    goalService.getUserWeeklyGoals().then(setWeeklyGoals);
  };

  // Function to go back to week view
  const handleBackToWeeks = () => {
    setSelectedWeek(null);
  };

  // Function to handle adding a new goal item
  const handleAddGoalItem = (goalId: string) => {
    setCurrentGoalId(goalId);
    setShowAddItemModal(true);
  };

  // Function to save a new goal item
  const saveGoalItem = async (title: string) => {
    if (!currentGoalId) return;

    try {
      await goalService.addGoalItem(currentGoalId, title);
      Alert.alert("Success", `Added item "${title}" to goal`);
    } catch (error) {
      console.error("Error adding goal item:", error);
      Alert.alert("Error", "Failed to add goal item");
    }
  };

  // Function to toggle goal item completion
  const toggleGoalItemCompletion = async (
    goalId: string,
    itemId: string,
    completed: boolean
  ) => {
    try {
      await goalService.updateGoalItemStatus(goalId, itemId, !completed);
    } catch (error) {
      console.error("Error updating goal item:", error);
      Alert.alert("Error", "Failed to update goal item");
    }
  };

  // Get category color
  const getCategoryColor = (
    category: string
  ): { bg: string; text: string; badge: string } => {
    switch (category) {
      case "SPORTING":
        return { bg: "#EBF5FF", text: "#3B82F6", badge: "#3B82F6" };
      case "ACADEMIC":
        return { bg: "#E0F7FA", text: "#0D9488", badge: "#0D9488" };
      case "HEALTH":
        return { bg: "#F3E8FF", text: "#8B5CF6", badge: "#8B5CF6" };
      default:
        return { bg: "#F3F4F6", text: "#6B7280", badge: "#6B7280" };
    }
  };

  // Get status text and color
  const getStatusInfo = (status: string): { text: string; color: string } => {
    switch (status) {
      case "completed":
        return { text: "Completed", color: "#10B981" };
      case "in-progress":
        return { text: "In Progress", color: "#F59E0B" };
      default:
        return { text: "Not Started", color: "#6B7280" };
    }
  };

  // Calculate progress percentage
  const calculateProgress = (completed: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  // Render monthly goal card
  const renderMonthlyGoal = ({ item }: { item: MonthlyGoal }) => (
    <TouchableOpacity
      style={[styles.monthlyGoalCard, { backgroundColor: item.color }]}
      onPress={() => handleMonthSelect(item.id)}
    >
      <Text style={styles.monthlyGoalMonth}>{item.month}</Text>
      <Text style={styles.monthlyGoalCount}>{item.goals} Goals</Text>
    </TouchableOpacity>
  );

  // Render weekly goal card with Firebase data
  const renderWeeklyGoal = ({ item }: { item: WeeklyGoal }) => {
    const categoryColors = getCategoryColor(item.category);
    const progress = calculateProgress(item.completedItems, item.totalItems);
    const statusInfo = getStatusInfo(item.status);

    return (
      <TouchableOpacity
        style={styles.weeklyGoalCard}
        onPress={() => handleWeekSelect(item.id)}
      >
        <View style={styles.weeklyGoalContent}>
          <Text style={styles.weeklyGoalTitle}>{item.title}</Text>
          <Text style={styles.weeklyGoalDescription}>{item.description}</Text>

          <View style={styles.weeklyGoalStatusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusInfo.color },
              ]}
            >
              <Text style={styles.statusText}>{statusInfo.text}</Text>
            </View>
          </View>

          <View style={styles.weeklyGoalProgressContainer}>
            <View style={styles.weeklyGoalProgressBar}>
              <View
                style={[
                  styles.weeklyGoalProgress,
                  {
                    width: `${progress}%`,
                    backgroundColor: categoryColors.badge,
                  },
                ]}
              />
            </View>
            <Text style={styles.weeklyGoalProgressText}>
              {item.completedItems}/{item.totalItems} completed
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.weeklyGoalCategory,
            { backgroundColor: categoryColors.bg },
          ]}
        >
          <Text
            style={[
              styles.weeklyGoalCategoryText,
              { color: categoryColors.text },
            ]}
          >
            {item.category}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render goal item
  const renderGoalItem = (item: GoalItem, goalId: string) => (
    <TouchableOpacity
      key={item.id}
      style={styles.goalItemContainer}
      onPress={() => toggleGoalItemCompletion(goalId, item.id, item.completed)}
    >
      <View
        style={[
          styles.goalItemCheckbox,
          { backgroundColor: item.completed ? "#10B981" : "#F3F4F6" },
        ]}
      >
        {item.completed && (
          <Ionicons name="checkmark" size={16} color="white" />
        )}
      </View>
      <Text
        style={[
          styles.goalItemText,
          item.completed && styles.goalItemTextCompleted,
        ]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  // Find the selected goal
  const selectedGoal = selectedWeek
    ? weeklyGoals.find((g) => g.id === selectedWeek)
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Updated Header - removed menu button */}
      <View style={styles.header}>
        {selectedMonth || selectedWeek ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={selectedWeek ? handleBackToWeeks : handleBackToMonths}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>
          {selectedWeek
            ? "Weekly Goal Details"
            : selectedMonth
            ? "Weekly Goals"
            : "Your Goals"}
        </Text>
        <View style={styles.backButton} /> {/* Empty view for spacing */}
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading goals...</Text>
          </View>
        ) : (
          <>
            {!selectedMonth && !selectedWeek && (
              <>
                {/* Monthly Goals */}
                <Text style={styles.sectionTitle}>Monthly Goals</Text>
                {monthlyGoals.length === 0 ? (
                  <Text style={styles.emptyText}>No monthly goals yet</Text>
                ) : (
                  <FlatList
                    data={monthlyGoals}
                    renderItem={renderMonthlyGoal}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.monthlyGoalsContainer}
                  />
                )}
              </>
            )}

            {/* Weekly Goals */}
            {(selectedMonth || !selectedWeek) && (
              <>
                <Text style={styles.sectionTitle}>
                  {selectedMonth
                    ? `Weekly Goals for ${
                        monthlyGoals.find((m) => m.id === selectedMonth)?.month
                      }`
                    : "Weekly Goals"}
                </Text>
                {weeklyGoals.length === 0 ? (
                  <Text style={styles.emptyText}>No weekly goals yet</Text>
                ) : (
                  <FlatList
                    data={weeklyGoals}
                    renderItem={renderWeeklyGoal}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    contentContainerStyle={styles.weeklyGoalsContainer}
                  />
                )}
              </>
            )}

            {/* Weekly Goal Details */}
            {selectedWeek && selectedGoal && (
              <View style={styles.goalDetails}>
                <Text style={styles.goalDetailsTitle}>
                  {selectedGoal.title}
                </Text>

                {/* Goal Progress */}
                <View style={styles.goalDetailsCard}>
                  <View style={styles.goalDetailsHeader}>
                    <Text style={styles.goalDetailsSubtitle}>Progress</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: getStatusInfo(selectedGoal.status)
                            .color,
                        },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {getStatusInfo(selectedGoal.status).text}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.goalDetailsProgressBar}>
                    <View
                      style={[
                        styles.goalDetailsProgress,
                        {
                          width: `${calculateProgress(
                            selectedGoal.completedItems,
                            selectedGoal.totalItems
                          )}%`,
                          backgroundColor: getCategoryColor(
                            selectedGoal.category
                          ).badge,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.goalDetailsProgressText}>
                    {calculateProgress(
                      selectedGoal.completedItems,
                      selectedGoal.totalItems
                    )}
                    % Complete
                  </Text>
                </View>

                {/* Goal Description */}
                <View style={styles.goalDetailsCard}>
                  <Text style={styles.goalDetailsSubtitle}>Description</Text>
                  <Text style={styles.goalDetailsDescription}>
                    {selectedGoal.description}
                  </Text>
                </View>

                {/* Goal Items */}
                <View style={styles.goalDetailsCard}>
                  <View style={styles.goalDetailsHeader}>
                    <Text style={styles.goalDetailsSubtitle}>Goal Items</Text>
                    <TouchableOpacity
                      style={styles.addItemButton}
                      onPress={() => handleAddGoalItem(selectedGoal.id)}
                    >
                      <Ionicons name="add" size={20} color="#8B5CF6" />
                    </TouchableOpacity>
                  </View>

                  {selectedGoal.items.length === 0 ? (
                    <Text style={styles.emptyText}>No items yet</Text>
                  ) : (
                    selectedGoal.items.map((item) =>
                      renderGoalItem(item, selectedGoal.id)
                    )
                  )}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => router.push("/newGoal")}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Add Goal Item Modal */}
      <AddGoalItemModal
        visible={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        onAdd={saveGoalItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#8B5CF6",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  backButton: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  monthlyGoalsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  monthlyGoalCard: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginRight: 10,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  monthlyGoalMonth: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  monthlyGoalCount: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  weeklyGoalsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  weeklyGoalCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  weeklyGoalContent: {
    flex: 1,
    marginRight: 10,
  },
  weeklyGoalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 5,
  },
  weeklyGoalDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 10,
  },
  weeklyGoalProgressContainer: {
    marginTop: 5,
  },
  weeklyGoalProgressBar: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    marginBottom: 5,
  },
  weeklyGoalProgress: {
    height: "100%",
    borderRadius: 2,
  },
  weeklyGoalCategory: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  weeklyGoalCategoryText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  goalDetails: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  goalDetailsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 15,
  },
  goalDetailsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  goalDetailsSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 10,
  },
  goalDetailsProgressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 10,
  },
  goalDetailsProgress: {
    height: "100%",
    borderRadius: 4,
  },
  goalDetailsProgressText: {
    fontSize: 14,
    color: "#6B7280",
  },
  goalDetailsDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  // New styles for Firebase integration
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    color: "#6B7280",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  fabButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  weeklyGoalStatusContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weeklyGoalProgressText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  goalDetailsHeader: {
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  goalItemCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  goalItemText: {
    fontSize: 16,
    color: "#1F2937",
    flex: 1,
  },
  goalItemTextCompleted: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width - 60,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 10,
  },
  modalButtonText: {
    fontSize: 16,
    color: "#6B7280",
  },
  modalPrimaryButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 8,
  },
  modalPrimaryButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
});

export default GoalsPage;
