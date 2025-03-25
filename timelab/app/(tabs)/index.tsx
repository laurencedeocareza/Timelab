import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
  StyleSheet,
} from "react-native";

// Define types for our data
interface MonthData {
  id: number;
  name: string;
  shortName: string;
  tasks: number;
}

interface DailyStats {
  day: string;
  tasksFinished: number;
  otherTasks: number;
}

export default function HomeScreen() {
  const [selectedWeek, setSelectedWeek] = useState("Week 1");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Data for months
  const months: MonthData[] = [
    { id: 1, name: "January", shortName: "JAN", tasks: 40 },
    { id: 2, name: "February", shortName: "FEB", tasks: 40 },
    { id: 3, name: "March", shortName: "MAR", tasks: 35 },
    { id: 4, name: "April", shortName: "APR", tasks: 42 },
    { id: 5, name: "May", shortName: "MAY", tasks: 37 },
    { id: 6, name: "June", shortName: "JUN", tasks: 45 },
    { id: 7, name: "July", shortName: "JUL", tasks: 39 },
    { id: 8, name: "August", shortName: "AUG", tasks: 41 },
    { id: 9, name: "September", shortName: "SEP", tasks: 38 },
    { id: 10, name: "October", shortName: "OCT", tasks: 43 },
    { id: 11, name: "November", shortName: "NOV", tasks: 36 },
    { id: 12, name: "December", shortName: "DEC", tasks: 44 },
  ];

  const weeks: string[] = ["Week 1", "Week 2", "Week 3", "Week 4"];

  const dailyStats: DailyStats[] = [
    { day: "Sunday", tasksFinished: 5, otherTasks: 3 },
    { day: "Monday", tasksFinished: 8, otherTasks: 4 },
    { day: "Tuesday", tasksFinished: 6, otherTasks: 2 },
    { day: "Wednesday", tasksFinished: 10, otherTasks: 5 },
    { day: "Thursday", tasksFinished: 7, otherTasks: 3 },
    { day: "Friday", tasksFinished: 6, otherTasks: 4 },
    { day: "Saturday", tasksFinished: 5, otherTasks: 2 },
  ];

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const selectWeek = (week: string) => {
    setSelectedWeek(week);
    setDropdownOpen(false);
  };

  const renderMonthCard = ({ item }: { item: MonthData }) => (
    <View style={styles.monthCard}>
      <Text style={styles.monthName}>{item.name}</Text>
      <Text style={styles.taskCount}>{item.tasks}</Text>
      <Text style={styles.monthShort}>{item.shortName}</Text>
      <Text style={styles.taskText}>Tasks completed</Text>
    </View>
  );

  const getBarWidth = (value: number): number => {
    const maxWidth = Platform.OS === "web" ? 300 : 200; // Adjust max width for web
    const scaleFactor = maxWidth / 15;
    return value * scaleFactor;
  };

  return (
    <View style={styles.container}>
      {/* Monthly Scrollable Cards */}
      <FlatList
        data={months}
        renderItem={renderMonthCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          alignItems: "flex-start",
        }} // Make sure it aligns properly
        style={{ flexGrow: 0 }}
      />

      {/* Statistics Section */}
      <View style={styles.statisticsContainer}>
        <Text style={styles.statisticsTitle}>Statistics</Text>

        {/* Week Dropdown */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity onPress={toggleDropdown} style={styles.dropdown}>
            <Text style={styles.dropdownText}>{selectedWeek}</Text>
            <Text>▼</Text>
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={styles.dropdownMenu}>
              {weeks.map((week, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => selectWeek(week)}
                  style={styles.dropdownItem}
                >
                  <Text>{week}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Bar Chart */}
        <View style={styles.chartContainer}>
          {dailyStats.map((stat, index) => (
            <View key={index} style={styles.chartRow}>
              <Text style={styles.dayText}>{stat.day}</Text>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.barSegment,
                    {
                      width: getBarWidth(stat.otherTasks),
                      backgroundColor: "#A78BFA",
                    },
                  ]}
                />
                <View
                  style={[
                    styles.barSegment,
                    {
                      width: getBarWidth(stat.otherTasks + 2),
                      backgroundColor: "#F87171",
                    },
                  ]}
                />
                <View
                  style={[
                    styles.barSegment,
                    {
                      width: getBarWidth(stat.tasksFinished),
                      backgroundColor: "#60A5FA",
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "#60A5FA" }]}
            />
            <Text>Tasks Finished</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "#F87171" }]}
            />
            <Text>In Progress</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "#A78BFA" }]}
            />
            <Text>Paused</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  headerTitle: { fontSize: 22, fontWeight: "bold", textAlign: "center" },

  monthList: { paddingHorizontal: 16, paddingVertical: 10 },

  monthCard: {
    height: 200,
    width: 140,
    backgroundColor: "#FCA5A5",
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    shadowColor: "#000", // Added shadow for depth
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "500",
  },
  monthName: { fontSize: 16, fontWeight: "bold" },
  taskCount: { fontSize: 32, fontWeight: "bold", marginVertical: 6 },
  monthShort: {
    fontSize: 30,
    color: "#999",
    position: "absolute",
    top: 10,
    right: 10,
  },
  taskText: { fontSize: 12 },

  statisticsContainer: { flex: 1, backgroundColor: "#F3F4F6", padding: 16 },
  statisticsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  dropdownContainer: { marginBottom: 12 },
  dropdown: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdownMenu: { borderWidth: 1, backgroundColor: "#fff", marginTop: 4 },
  dropdownItem: { padding: 8, borderBottomWidth: 1 },

  chartContainer: { marginTop: 10 },
  chartRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  dayText: { width: 80, textAlign: "right", marginRight: 8 },
  barContainer: { flexDirection: "row" },
  barSegment: { height: 20 },

  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 6,
  },
  legendColor: { width: 10, height: 10, marginRight: 4 },
});
