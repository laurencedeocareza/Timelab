// import React from "react";
// import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
// import { Ionicons } from "@expo/vector-icons"; // For icons
// import tw from "tailwind-react-native-classnames"; // For styling

// const weeklyGoals = [
//   { id: "1", name: "Goal Name" },
//   { id: "2", name: "Goal Name" },
//   { id: "3", name: "Goal Name" },
// ];

// const dailyGoals = [
//   { id: "1", name: "Goal Name", time: "Due: 5:00 PM" },
//   { id: "2", name: "Goal Name", time: "Due: 6:00 PM" },
//   { id: "3", name: "Goal Name", time: "Due: 7:00 PM" },
// ];

// const GoalPage = () => {
//   return (
//     <View style={tw`flex-1 bg-white`}>
//       {/* Weekly Goals Section */}
//       <Text style={tw`text-lg font-bold text-center mt-4 mb-2`}>
//         Weekly Goals
//       </Text>
//       <FlatList
//         data={weeklyGoals}
//         horizontal
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={tw`px-4`}
//         renderItem={({ item }) => (
//           <View
//             style={tw`bg-blue-100 w-32 h-32 rounded-lg justify-center items-center mr-4`}
//           >
//             <Text style={tw`text-sm font-bold text-center`}>{item.name}</Text>
//           </View>
//         )}
//       />

//       {/* Daily Goals Section */}
//       <Text style={tw`text-lg font-bold text-center mt-6 mb-2`}>
//         Daily Goals
//       </Text>
//       <FlatList
//         data={dailyGoals}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={tw`px-4`}
//         renderItem={({ item }) => (
//           <View
//             style={tw`bg-blue-100 rounded-lg p-4 mb-4 flex-row justify-between items-center`}
//           >
//             <Text style={tw`text-sm font-bold`}>{item.name}</Text>
//             <Text style={tw`text-xs text-gray-500`}>{item.time}</Text>
//             <TouchableOpacity>
//               <Ionicons name="ellipsis-vertical" size={20} color="gray" />
//             </TouchableOpacity>
//           </View>
//         )}
//       />

//       {/* New Task Button */}
//       <TouchableOpacity
//         style={tw`bg-blue-500 py-3 px-10 rounded absolute bottom-8 self-center`}
//         onPress={() => console.log("New Task pressed")}
//       >
//         <Text style={tw`text-white text-base font-bold`}>New Task</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface GoalCardProps {
  title: string;
  description: string;
  category: string;
  weeksLeft: number;
  progress: number;
}

const GoalCard: React.FC<GoalCardProps> = ({
  title,
  description,
  category,
  weeksLeft,
  progress,
}) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "SPORTING":
        return "bg-blue-100 text-blue-500";
      case "ACADEMIC":
        return "bg-cyan-100 text-cyan-600";
      case "HEALTH":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <View style={tw`flex-row bg-white rounded-xl p-4 mb-3 shadow`}>
      <View style={tw`flex-1`}>
        <Text style={tw`text-base font-semibold mb-1`}>{title}</Text>
        <Text style={tw`text-sm text-gray-500 mb-2`}>{description}</Text>
        <View style={tw`mt-1`}>
          <View style={tw`h-1 bg-gray-200 rounded-full mb-2`}>
            <View
              style={[
                tw`h-1 bg-purple-500 rounded-full`,
                { width: `${progress}%` },
              ]}
            />
          </View>
          <Text style={tw`text-xs text-gray-500`}>
            {weeksLeft} {weeksLeft === 1 ? "week" : "weeks"} to achieve goal
          </Text>
        </View>
      </View>
      <View style={tw`justify-center ml-2`}>
        <View style={tw`${getCategoryColor(category)} px-3 py-1 rounded-full`}>
          <Text style={tw`text-xs font-bold`}>{category}</Text>
        </View>
      </View>
    </View>
  );
};

interface FeatureCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon }) => {
  return (
    <View
      style={tw`bg-white rounded-xl p-4 mr-3 shadow items-center justify-center w-40 h-48`}
    >
      <View style={tw`items-center justify-center h-24 w-24 mb-3`}>
        <Ionicons name={icon} size={48} color="#a066cc" />
      </View>
      <Text style={tw`text-sm font-medium text-center mb-3`}>{title}</Text>
      <View style={tw`flex-row justify-center`}>
        <View style={tw`h-1.5 w-1.5 rounded-full bg-gray-200 mx-1`} />
        <View style={tw`h-1.5 w-1.5 rounded-full bg-purple-500 mx-1`} />
        <View style={tw`h-1.5 w-1.5 rounded-full bg-gray-200 mx-1`} />
      </View>
    </View>
  );
};

interface GoalTrackerProps {
  navigation: NativeStackNavigationProp<any>;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState<"weekly" | "daily">("weekly");

  return (
    <SafeAreaView style={tw`flex-1 bg-purple-500`}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={tw`flex-row justify-between items-center px-4 py-3`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-white`}>Your Goals</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Feature Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={tw`px-4 pt-4`}
      >
        <FeatureCard title="Read a book per fortnight" icon="book-outline" />
        <FeatureCard
          title="Save for next overseas trip"
          icon="airplane-outline"
        />
        <View style={tw`w-20 h-48`} />
      </ScrollView>

      {/* Tab Selection */}
      <View style={tw`flex-row px-4 mt-4`}>
        <TouchableOpacity
          style={tw`mr-4 pb-2 ${
            selectedTab === "weekly" ? "border-b-2 border-white" : ""
          }`}
          onPress={() => setSelectedTab("weekly")}
        >
          <Text
            style={tw`text-lg font-medium ${
              selectedTab === "weekly" ? "text-white" : "text-white opacity-70"
            }`}
          >
            Weekly Goals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`pb-2 ${
            selectedTab === "daily" ? "border-b-2 border-white" : ""
          }`}
          onPress={() => setSelectedTab("daily")}
        >
          <Text
            style={tw`text-lg font-medium ${
              selectedTab === "daily" ? "text-white" : "text-white opacity-70"
            }`}
          >
            Daily Goals
          </Text>
        </TouchableOpacity>
      </View>

      {/* Goal List */}
      <ScrollView style={tw`flex-1 px-4 pt-4 bg-gray-50 rounded-t-3xl mt-4`}>
        {selectedTab === "weekly" ? (
          <>
            <GoalCard
              title="Go to the gym 4 times a week"
              description="3 times to achieve complete goal"
              category="SPORTING"
              weeksLeft={2}
              progress={60}
            />
            <GoalCard
              title="Read three times for 30min"
              description="10 weeks to achieve complete goal"
              category="ACADEMIC"
              weeksLeft={10}
              progress={20}
            />
            <GoalCard
              title="Get 8 hours sleep 5 nights"
              description="1 week to achieve goal"
              category="HEALTH"
              weeksLeft={1}
              progress={80}
            />
          </>
        ) : (
          <>
            <GoalCard
              title="Meditate for 10 minutes"
              description="Daily practice"
              category="HEALTH"
              weeksLeft={0}
              progress={0}
            />
            <GoalCard
              title="Drink 8 glasses of water"
              description="Stay hydrated"
              category="HEALTH"
              weeksLeft={0}
              progress={50}
            />
            <GoalCard
              title="Review daily tasks"
              description="Morning routine"
              category="ACADEMIC"
              weeksLeft={0}
              progress={100}
            />
          </>
        )}
        <View style={tw`h-24`} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={tw`absolute bottom-6 left-0 right-0 px-4`}>
        <TouchableOpacity
          style={tw`bg-purple-600 h-14 rounded-full justify-center items-center shadow-lg`}
          onPress={() => navigation.navigate("NewGoal")}
        >
          <Text style={tw`text-white font-bold text-base`}>NEW GOAL</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GoalTracker;
