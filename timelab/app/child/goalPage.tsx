"use client";

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  // Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

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
  goals: number;
  color: string;
};

type WeeklyGoal = {
  id: string;
  title: string;
  description: string;
  category: "SPORTING" | "ACADEMIC" | "HEALTH" | string;
  weeksLeft: number;
  progress: number;
};

type FeaturedGoal = {
  id: string;
  title: string;
  // image: any;
  color: string;
};

type CategoryColors = {
  bg: string;
  text: string;
  badge: string;
};

// Sample data for monthly goals
const monthlyGoals: MonthlyGoal[] = [
  { id: "1", month: "January", goals: 3, color: "#8B5CF6" },
  { id: "2", month: "February", goals: 5, color: "#EC4899" },
  { id: "3", month: "March", goals: 2, color: "#F59E0B" },
  { id: "4", month: "April", goals: 4, color: "#10B981" },
  { id: "5", month: "May", goals: 6, color: "#3B82F6" },
  { id: "6", month: "June", goals: 3, color: "#EF4444" },
  { id: "7", month: "July", goals: 5, color: "#8B5CF6" },
  { id: "8", month: "August", goals: 2, color: "#EC4899" },
  { id: "9", month: "September", goals: 4, color: "#F59E0B" },
  { id: "10", month: "October", goals: 1, color: "#10B981" },
  { id: "11", month: "November", goals: 3, color: "#3B82F6" },
  { id: "12", month: "December", goals: 7, color: "#EF4444" },
];

// Sample data for weekly goals
const weeklyGoals: WeeklyGoal[] = [
  {
    id: "1",
    title: "Go to the gym 4 times a week",
    description: "3 times to achieve complete goal",
    category: "SPORTING",
    weeksLeft: 2,
    progress: 60,
  },
  {
    id: "2",
    title: "Read three times for 30min",
    description: "10 weeks to achieve complete goal",
    category: "ACADEMIC",
    weeksLeft: 10,
    progress: 20,
  },
  {
    id: "3",
    title: "Get 8 hours sleep 5 nights",
    description: "1 week to achieve goal",
    category: "HEALTH",
    weeksLeft: 1,
    progress: 80,
  },
];

// Sample data for featured goals
const featuredGoals: FeaturedGoal[] = [
  {
    id: "1",
    title: "Read a book per fortnight",
    // image: require("./assets/reading.png"),
    color: "#8B5CF6",
  },
  {
    id: "2",
    title: "Save for next overseas trip",
    // image: require("./assets/travel.png"),
    color: "#EC4899",
  },
  {
    id: "3",
    title: "Learn a new language",
    // image: require("./assets/language.png"),
    color: "#10B981",
  },
];

// Placeholder images for the featured goals
const placeholderImages = {
  reading:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=100&width=100",
  travel:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=100&width=100",
  language:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=100&width=100",
};

const GoalsPage = ({ navigation }: GoalsPageProps) => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  // Function to handle month selection
  const handleMonthSelect = (monthId: string) => {
    setSelectedMonth(monthId);
    setSelectedWeek(null); // Reset week selection when month changes
  };

  // Function to handle week selection
  const handleWeekSelect = (weekId: string) => {
    setSelectedWeek(weekId);
  };

  // Function to go back to month view
  const handleBackToMonths = () => {
    setSelectedMonth(null);
    setSelectedWeek(null);
  };

  // Function to go back to week view
  const handleBackToWeeks = () => {
    setSelectedWeek(null);
  };

  // Get category color
  const getCategoryColor = (category: string): CategoryColors => {
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

  // Render featured goal card
  const renderFeaturedGoal = ({ item }: { item: FeaturedGoal }) => (
    <TouchableOpacity
      style={[styles.featuredGoalCard, { backgroundColor: "white" }]}
      onPress={() => handleMonthSelect(item.id)}
    >
      <View style={styles.featuredGoalImageContainer}>
        {/* <Image
          source={{
            uri: placeholderImages[
              item.id === "1"
                ? "reading"
                : item.id === "2"
                ? "travel"
                : "language"
            ],
          }}
          style={styles.featuredGoalImage}
        /> */}
      </View>
      <Text style={styles.featuredGoalTitle}>{item.title}</Text>
      <View style={styles.featuredGoalIndicator}>
        <View
          style={[
            styles.featuredGoalIndicatorDot,
            { backgroundColor: "#E5E7EB" },
          ]}
        />
        <View
          style={[
            styles.featuredGoalIndicatorDot,
            { backgroundColor: item.color },
          ]}
        />
        <View
          style={[
            styles.featuredGoalIndicatorDot,
            { backgroundColor: "#E5E7EB" },
          ]}
        />
      </View>
    </TouchableOpacity>
  );

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

  // Render weekly goal card
  const renderWeeklyGoal = ({ item }: { item: WeeklyGoal }) => {
    const categoryColors = getCategoryColor(item.category);

    return (
      <TouchableOpacity
        style={styles.weeklyGoalCard}
        onPress={() => handleWeekSelect(item.id)}
      >
        <View style={styles.weeklyGoalContent}>
          <Text style={styles.weeklyGoalTitle}>{item.title}</Text>
          <Text style={styles.weeklyGoalDescription}>{item.description}</Text>
          <View style={styles.weeklyGoalProgressContainer}>
            <View style={styles.weeklyGoalProgressBar}>
              <View
                style={[
                  styles.weeklyGoalProgress,
                  {
                    width: `${item.progress}%`,
                    backgroundColor: categoryColors.badge,
                  },
                ]}
              />
            </View>
            <Text style={styles.weeklyGoalTimeLeft}>
              {item.weeksLeft} {item.weeksLeft === 1 ? "week" : "weeks"} to
              achieve goal
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

  // Find the selected goal
  const selectedGoal = selectedWeek
    ? weeklyGoals.find((g) => g.id === selectedWeek)
    : null;
  const selectedGoalProgress = selectedGoal?.progress || 0;
  const selectedGoalCategory = selectedGoal?.category || "";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        {selectedMonth || selectedWeek ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={selectedWeek ? handleBackToWeeks : handleBackToMonths}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}

        <Text style={styles.headerTitle}>
          {selectedWeek
            ? "Weekly Goal Details"
            : selectedMonth
            ? "Weekly Goals"
            : "Your Goals"}
        </Text>

        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {!selectedMonth && !selectedWeek && (
          <>
            {/* Featured Goals */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredGoalsContainer}
            >
              {featuredGoals.map((goal) => (
                <View key={goal.id} style={styles.featuredGoalCard}>
                  {/* <Image
                    source={{
                      uri: placeholderImages[
                        goal.id === "1"
                          ? "reading"
                          : goal.id === "2"
                          ? "travel"
                          : "language"
                      ],
                    }}
                    style={styles.featuredGoalImage}
                  /> */}
                  <Text style={styles.featuredGoalTitle}>{goal.title}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Monthly Goals */}
            <Text style={styles.sectionTitle}>Monthly Goals</Text>
            <FlatList
              data={monthlyGoals}
              renderItem={renderMonthlyGoal}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.monthlyGoalsContainer}
            />
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
            <FlatList
              data={weeklyGoals}
              renderItem={renderWeeklyGoal}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.weeklyGoalsContainer}
            />
          </>
        )}

        {/* Weekly Goal Details */}
        {selectedWeek && selectedGoal && (
          <View style={styles.goalDetails}>
            <Text style={styles.goalDetailsTitle}>{selectedGoal.title}</Text>

            {/* Goal details content would go here */}
            <View style={styles.goalDetailsCard}>
              <Text style={styles.goalDetailsSubtitle}>Progress</Text>
              <View style={styles.goalDetailsProgressBar}>
                <View
                  style={[
                    styles.goalDetailsProgress,
                    {
                      width: `${selectedGoalProgress}%`,
                      backgroundColor:
                        getCategoryColor(selectedGoalCategory).badge,
                    },
                  ]}
                />
              </View>
              <Text style={styles.goalDetailsProgressText}>
                {selectedGoalProgress}% Complete
              </Text>
            </View>

            <View style={styles.goalDetailsCard}>
              <Text style={styles.goalDetailsSubtitle}>Description</Text>
              <Text style={styles.goalDetailsDescription}>
                {selectedGoal.description}
              </Text>
            </View>

            <View style={styles.goalDetailsCard}>
              <Text style={styles.goalDetailsSubtitle}>Time Remaining</Text>
              <Text style={styles.goalDetailsTimeLeft}>
                {selectedGoal.weeksLeft}{" "}
                {selectedGoal.weeksLeft === 1 ? "week" : "weeks"} left
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* New Goal Button */}
      <TouchableOpacity
        style={styles.newGoalButton}
        onPress={() => navigation.navigate("NewGoal")}
      >
        <Text style={styles.newGoalButtonText}>NEW GOAL</Text>
      </TouchableOpacity>
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
  menuButton: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    paddingBottom: 80,
  },
  featuredGoalsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  featuredGoalCard: {
    width: 160,
    height: 200,
    backgroundColor: "white",
    borderRadius: 16,
    marginRight: 15,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  featuredGoalImageContainer: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  featuredGoalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  featuredGoalTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#1F2937",
  },
  featuredGoalIndicator: {
    flexDirection: "row",
    marginTop: 10,
  },
  featuredGoalIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
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
  weeklyGoalTimeLeft: {
    fontSize: 12,
    color: "#6B7280",
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
  goalDetailsTimeLeft: {
    fontSize: 14,
    color: "#6B7280",
  },
  newGoalButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#8B5CF6",
    borderRadius: 30,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  newGoalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GoalsPage;
