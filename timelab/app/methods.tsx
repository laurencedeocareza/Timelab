import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useRouter } from "expo-router"; // Add this import

interface Tool {
  id: number;
  title: string;
  icon: any;
  colors: string[];
  route?: string; // Add route property
}

export default function Tools() {
  const router = useRouter(); // Add router

  const tools: Tool[] = [
    {
      id: 1,
      title: "Pomodoro",
      icon: require("../assets/images/pomodoro.png"),
      colors: ["bg-green-100", "bg-green-200"],
      route: "pomodoro", // Remove the leading slash
    },
    {
      id: 2,
      title: "Timeboxing",
      icon: require("../assets/images/timeboxing.png"),
      colors: ["bg-blue-100", "bg-blue-200"],
      route: "/timeboxing", // Updated route to direct to timeboxing.tsx
    },
    {
      id: 3,
      title: "Flowtime",
      icon: require("../assets/images/flowtime.png"),
      colors: ["bg-purple-100", "bg-purple-200"],
      route: "/flowTime", // Route to flowTime.tsx file
    },
    {
      id: 4,
      title: "Custom",
      icon: require("../assets/images/custom-icon.png"),
      colors: ["bg-yellow-100", "bg-yellow-200"],
      route: "/(tabs)/custom",
    },
  ];

  // Add function to handle navigation
  const handleToolPress = (tool: Tool) => {
    if (tool.route) {
      console.log("Navigating to:", tool.route);
      router.push(tool.route as any);
    }
  };

  const renderIcon = (tool: Tool) => {
    return (
      <View style={tw`w-12 h-12 items-center justify-center`}>
        <Image source={tool.icon} style={tw`w-10 h-10`} resizeMode="contain" />
      </View>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`py-6 justify-center items-center`}>
        <Text style={tw`text-2xl font-bold text-black`}>Methods</Text>
      </View>

      {/* Grid Container */}
      <View style={tw`flex-row flex-wrap px-4 justify-between`}>
        {tools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={[
              tw`rounded-lg mb-6 p-4 items-center`,
              { width: Dimensions.get("window").width * 0.45 - 20 },
              tw`${tool.colors[0]}`,
            ]}
            activeOpacity={0.7}
            onPress={() => handleToolPress(tool)} // Add onPress handler
          >
            {renderIcon(tool)}
            <Text style={tw`text-center mt-2 font-medium text-lg`}>
              {tool.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
