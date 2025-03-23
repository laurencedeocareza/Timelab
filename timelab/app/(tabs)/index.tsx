import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
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

  // Weekly data for dropdown
  const weeks: string[] = ["Week 1", "Week 2", "Week 3", "Week 4"];

  // Stats data for bar chart
  const dailyStats: DailyStats[] = [
    { day: "Sunday", tasksFinished: 5, otherTasks: 3 },
    { day: "Monday", tasksFinished: 8, otherTasks: 4 },
    { day: "Tuesday", tasksFinished: 6, otherTasks: 2 },
    { day: "Wednesday", tasksFinished: 10, otherTasks: 5 },
    { day: "Thursday", tasksFinished: 7, otherTasks: 3 },
    { day: "Friday", tasksFinished: 6, otherTasks: 4 },
    { day: "Saturday", tasksFinished: 5, otherTasks: 2 },
  ];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const selectWeek = (week: string) => {
    setSelectedWeek(week);
    setDropdownOpen(false);
  };

  const renderMonthCard = ({ item }: { item: MonthData }) => (
    <View className="w-36 mr-4 bg-red-300 rounded-lg p-4">
      <Text className="text-base">{item.name}</Text>
      <Text className="text-6xl font-bold my-3">{item.tasks}</Text>
      <Text className="text-5xl font-thin text-gray-600 opacity-30 absolute top-10 right-4">
        {item.shortName}
      </Text>
      <Text className="text-sm">Tasks completed</Text>
    </View>
  );

  // Function to determine the width of bar segments
  const getBarWidth = (value: number): number => {
    // Maximum possible width (adjust as needed)
    const maxWidth = 200;
    // Assuming maximum value would be around 15 tasks
    const scaleFactor = maxWidth / 15;
    return value * scaleFactor;
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="w-full p-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-center">Home</Text>
      </View>

      {/* Monthly Scrollable Cards */}
      <View className="mt-4">
        <FlatList
          data={months}
          renderItem={renderMonthCard}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>

      {/* Statistics Section */}
      <View className="mt-6 bg-gray-100 flex-1">
        <View className="p-4 border-b border-gray-200">
          <Text className="text-xl font-bold text-center">Statistics</Text>
        </View>

        {/* Week Dropdown */}
        <View className="p-4">
          <TouchableOpacity
            onPress={toggleDropdown}
            className="border border-gray-800 rounded p-2 flex-row justify-between items-center"
          >
            <Text className="text-lg">{selectedWeek}</Text>
            <Text>▼</Text>
          </TouchableOpacity>

          {dropdownOpen && (
            <View className="mt-2 border border-gray-800 rounded bg-white">
              {weeks.map((week, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => selectWeek(week)}
                  className="p-2 border-b border-gray-300"
                >
                  <Text className="text-lg">{week}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Bar Chart */}
        <View className="mt-4 p-2">
          {dailyStats.map((stat, index) => (
            <View key={index} className="flex-row items-center mb-3">
              <Text className="w-24 text-right mr-2">{stat.day}</Text>
              <View className="flex-row">
                {/* Purple bar segment */}
                <View
                  style={{ width: getBarWidth(stat.otherTasks) }}
                  className="h-6 bg-purple-400 mr-0.5"
                />
                {/* Red bar segment */}
                <View
                  style={{ width: getBarWidth(stat.otherTasks + 2) }}
                  className="h-6 bg-red-300 mr-0.5"
                />
                {/* Blue bar segment */}
                <View
                  style={{ width: getBarWidth(stat.tasksFinished) }}
                  className="h-6 bg-blue-400"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Legend */}
        <View className="flex-row justify-end mt-2">
          <View className="flex-row items-center mr-4">
            <View className="w-4 h-4 bg-blue-400 mr-1" />
            <Text className="text-xs">Tasks Finished</Text>
          </View>
          <View className="flex-row items-center mr-4">
            <View className="w-4 h-4 bg-red-300 mr-1" />
            <Text className="text-xs">In Progress</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 bg-purple-400 mr-1" />
            <Text className="text-xs">Paused</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
