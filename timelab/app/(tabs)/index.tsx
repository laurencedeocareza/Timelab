"use client";

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Month data for the 12 month cards
const months = [
  { name: "January", color: "#4361EE", tasks: 5 },
  { name: "February", color: "#F9703B", tasks: 8 },
  { name: "March", color: "#10B981", tasks: 3 },
  { name: "April", color: "#8B5CF6", tasks: 7 },
  { name: "May", color: "#EC4899", tasks: 4 },
  { name: "June", color: "#F59E0B", tasks: 6 },
  { name: "July", color: "#3B82F6", tasks: 9 },
  { name: "August", color: "#EF4444", tasks: 2 },
  { name: "September", color: "#14B8A6", tasks: 5 },
  { name: "October", color: "#6366F1", tasks: 7 },
  { name: "November", color: "#8B5CF6", tasks: 4 },
  { name: "December", color: "#F97316", tasks: 8 },
];

export default function Dashboard() {
  const [username, setUsername] = useState("Samantha");

  // Simple bar chart component that doesn't use SVG
  const SimpleBarChart = () => {
    const data = [20, 45, 28, 80, 99, 43];
    const maxValue = Math.max(...data);

    return (
      <View style={styles.simpleChart}>
        <View style={styles.chartBars}>
          {data.map((value, index) => (
            <View key={index} style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${(value / maxValue) * 100}%`,
                    backgroundColor: "#4361EE",
                  },
                ]}
              />
            </View>
          ))}
        </View>
        <View style={styles.chartLabels}>
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => (
            <Text key={index} style={styles.chartLabel}>
              {month}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi {username}</Text>
            <Text style={styles.subGreeting}>Here are your projects</Text>
          </View>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{username.charAt(0)}</Text>
            </View>
          </View>
        </View>

        {/* Month Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cardsContainer}
          contentContainerStyle={styles.cardsContent}
        >
          {months.map((month, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: month.color }]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="calendar" size={20} color="#fff" />
                </View>
              </View>
              <View style={styles.cardDots}>
                {[...Array(8)].map((_, i) => (
                  <View key={i} style={styles.cardDot} />
                ))}
              </View>
              <Text style={styles.cardTitle}>{month.name}</Text>
              <Text style={styles.cardSubtitle}>Overview</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>{month.tasks} Tasks</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Chart Section */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.chartCard}>
            <SimpleBarChart />
          </View>
        </View>

        {/* Tasks Section */}
        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>Personal Tasks</Text>

          {/* Task Item 1 */}
          <View style={styles.taskItem}>
            <View style={[styles.taskIcon, { backgroundColor: "#F9703B" }]}>
              <Text style={styles.taskIconText}>N</Text>
            </View>
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>
                NDA Review for website project
              </Text>
              <Text style={styles.taskTime}>Today · 1pm</Text>
            </View>
            <View style={styles.taskStatus}>
              <View style={styles.taskStatusDot} />
            </View>
          </View>

          {/* Task Item 2 */}
          <View style={styles.taskItem}>
            <View style={[styles.taskIcon, { backgroundColor: "#4361EE" }]}>
              <Ionicons name="mail-outline" size={16} color="#fff" />
            </View>
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>
                Email Reply for Green Project
              </Text>
              <Text style={styles.taskTime}>Today · 1pm</Text>
            </View>
            <View style={styles.taskStatus}>
              <View style={styles.taskStatusDot} />
            </View>
          </View>

          {/* Task Item 3 */}
          <View style={styles.taskItem}>
            <View style={[styles.taskIcon, { backgroundColor: "#10B981" }]}>
              <Ionicons name="call-outline" size={16} color="#fff" />
            </View>
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>Call with design team</Text>
              <Text style={styles.taskTime}>Tomorrow · 10am</Text>
            </View>
            <View style={styles.taskStatus}>
              <View
                style={[styles.taskStatusDot, { backgroundColor: "#E5E7EB" }]}
              />
            </View>
          </View>
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
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  subGreeting: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  avatarContainer: {
    width: 60, // Increased from 50
    height: 60, // Increased from 50
    borderRadius: 30, // Increased from 25
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 56, // Increased from 46
    height: 56, // Increased from 46
    borderRadius: 28, // Increased from 23
    backgroundColor: "#F9703B",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24, // Increased from 20
    fontWeight: "bold",
    color: "#fff",
  },
  cardsContainer: {
    marginTop: 20,
  },
  cardsContent: {
    paddingHorizontal: 15,
    paddingRight: 20,
  },
  card: {
    width: 150,
    height: 180,
    borderRadius: 16,
    marginHorizontal: 5,
    padding: 16,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cardIconContainer: {
    width: 42, // Increased from 36
    height: 42, // Increased from 36
    borderRadius: 10, // Increased from 8
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardDots: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "70%",
    marginVertical: 10,
  },
  cardDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    margin: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  cardFooter: {
    marginTop: 10,
  },
  cardFooterText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  chartSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 15,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  simpleChart: {
    height: 220,
    width: "100%",
    paddingTop: 20,
  },
  chartBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 180,
    width: "100%",
    paddingHorizontal: 10,
  },
  barContainer: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 5,
  },
  bar: {
    width: 20,
    borderRadius: 10,
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  chartLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    flex: 1,
  },
  tasksSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  taskIcon: {
    width: 44, // Increased from 36
    height: 44, // Increased from 36
    borderRadius: 10, // Increased from 8
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  taskIconText: {
    fontSize: 18, // Increased from 16
    fontWeight: "bold",
    color: "#fff",
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  taskTime: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  taskStatus: {
    padding: 4,
  },
  taskStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F9703B",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  navItem: {
    alignItems: "center",
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F9703B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#F9703B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
