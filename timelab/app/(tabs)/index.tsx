import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import tw from "tailwind-react-native-classnames"; // Import Tailwind for styling

const { width: screenWidth, height: screenHeight } = Dimensions.get("window"); // Get screen dimensions

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
    <View
      style={[
        tw`bg-blue-100 rounded-lg p-4 shadow-md justify-between`,
        {
          width: screenWidth * 0.4, // Adjust width based on screen size
          height: screenHeight * 0.25, // Adjust height based on screen size
          marginRight: 16,
        },
      ]}
    >
      <Text style={tw`text-lg font-bold text-gray-800`}>{item.name}</Text>
      <Text style={tw`text-4xl font-extrabold text-blue-500`}>{item.tasks}</Text>
      <Text style={tw`text-sm text-gray-500`}>{item.shortName}</Text>
      <Text style={tw`text-xs text-gray-600`}>Tasks completed</Text>
    </View>
  );

  const getBarWidth = (value: number): number => {
    const maxWidth = screenWidth * 0.6; // Adjust max width based on screen size
    const scaleFactor = maxWidth / 15;
    return value * scaleFactor;
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* Monthly Scrollable Cards */}
      <FlatList
        data={months}
        renderItem={renderMonthCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-4 py-6`}
      />

      {/* Statistics Section */}
      <View
        style={[
          tw`bg-white rounded-t-3xl p-6 shadow-lg`,
          { paddingBottom: screenHeight * 0.05 }, // Adjust padding dynamically
        ]}
      >
        <Text style={tw`text-xl font-bold text-gray-800 mb-4 text-center`}>
          Statistics
        </Text>

        {/* Week Dropdown */}
        <View style={tw`mb-4`}>
          <TouchableOpacity
            onPress={toggleDropdown}
            style={tw`border border-gray-300 rounded-lg px-4 py-2 flex-row justify-between items-center`}
          >
            <Text style={tw`text-base font-medium text-gray-800`}>
              {selectedWeek}
            </Text>
            <Text style={tw`text-gray-500`}>▼</Text>
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={tw`border border-gray-300 bg-white rounded-lg mt-2`}>
              {weeks.map((week, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => selectWeek(week)}
                  style={tw`px-4 py-2 border-b border-gray-200`}
                >
                  <Text style={tw`text-base text-gray-800`}>{week}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Bar Chart */}
        <View>
          {dailyStats.map((stat, index) => (
            <View key={index} style={tw`flex-row items-center mb-4`}>
              <Text style={tw`w-20 text-sm text-gray-800`}>{stat.day}</Text>
              <View style={tw`flex-row flex-1`}>
                <View
                  style={[
                    tw`h-4 rounded-l-lg`,
                    {
                      width: getBarWidth(stat.otherTasks),
                      backgroundColor: "#A78BFA",
                    },
                  ]}
                />
                <View
                  style={[
                    tw`h-4`,
                    {
                      width: getBarWidth(stat.otherTasks + 2),
                      backgroundColor: "#F87171",
                    },
                  ]}
                />
                <View
                  style={[
                    tw`h-4 rounded-r-lg`,
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
        <View style={tw`flex-row justify-center mt-4`}>
          <View style={tw`flex-row items-center mr-4`}>
            <View style={tw`w-4 h-4 bg-blue-500 rounded-full mr-2`} />
            <Text style={tw`text-sm text-gray-800`}>Tasks Finished</Text>
          </View>
          <View style={tw`flex-row items-center mr-4`}>
            <View style={tw`w-4 h-4 bg-red-400 rounded-full mr-2`} />
            <Text style={tw`text-sm text-gray-800`}>In Progress</Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-4 h-4 bg-purple-400 rounded-full mr-2`} />
            <Text style={tw`text-sm text-gray-800`}>Paused</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
