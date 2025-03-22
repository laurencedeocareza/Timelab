import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";

// Define types for our tools
interface Tool {
  id: number;
  title: string;
  icon: string;
  iconType: string;
  colors: string[];
}

export default function Tools() {
  // Tool card data
  const tools: Tool[] = [
    {
      id: 1,
      title: "Methods",
      icon: "list-ul",
      iconType: "FontAwesome5",
      colors: ["#e0e8ff", "#d0d8ff"],
    },
    {
      id: 2,
      title: "Sleep Timer",
      icon: "moon",
      iconType: "FontAwesome5",
      colors: ["#e0f0ff", "#d0e8ff"],
    },
    {
      id: 3,
      title: "Sounds",
      icon: "wave-square",
      iconType: "FontAwesome5",
      colors: ["#e0f0ff", "#d0e8ff"],
    },
  ];

  const renderIcon = (tool: Tool) => {
    if (tool.id === 1) {
      return (
        <View className="w-12 h-12 items-center justify-center">
          <View className="w-7 h-7 mb-1 rounded-md border-2 border-black items-center justify-center">
            <View className="w-3 h-3 bg-black rounded-sm" />
          </View>
          <View className="w-8 h-2 bg-black rounded-full mb-1" />

          <View className="w-7 h-7 mb-1 rounded-md border-2 border-red-500 items-center justify-center">
            <View className="w-3 h-3 bg-red-500 rounded-sm" />
          </View>
          <View className="w-8 h-2 bg-red-500 rounded-full mb-1" />

          <View className="w-7 h-7 mb-1 rounded-md border-2 border-green-500 items-center justify-center">
            <View className="w-3 h-3 bg-green-500 rounded-sm" />
          </View>
          <View className="w-8 h-2 bg-green-500 rounded-full" />
        </View>
      );
    } else if (tool.id === 2) {
      return (
        <View className="w-12 h-12 items-center justify-center">
          <View className="w-8 h-8 bg-yellow-300 rounded-full" />
          <View className="absolute right-1 top-1">
            <Text className="text-blue-400 text-sm font-bold">z</Text>
            <Text className="text-blue-400 text-lg font-bold ml-2">z</Text>
            <Text className="text-blue-400 text-sm font-bold ml-4">z</Text>
          </View>
        </View>
      );
    } else if (tool.id === 3) {
      return (
        <View className="w-12 h-12 items-center justify-center flex-row">
          <View className="w-1.5 h-6 bg-pink-400 rounded-full mx-0.5" />
          <View className="w-1.5 h-8 bg-pink-500 rounded-full mx-0.5" />
          <View className="w-1.5 h-4 bg-purple-400 rounded-full mx-0.5" />
          <View className="w-1.5 h-7 bg-purple-500 rounded-full mx-0.5" />
          <View className="w-1.5 h-5 bg-pink-400 rounded-full mx-0.5" />
        </View>
      );
    } else if (tool.id === 4) {
      return (
        <View className="w-12 h-12 items-center justify-center">
          <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
            <View className="w-8 h-8 bg-red-500 rounded-full items-center justify-center">
              <View className="w-6 h-6 bg-white rounded-full items-center justify-center">
                <View className="w-4 h-4 bg-red-500 rounded-full" />
              </View>
            </View>
          </View>
          <View className="absolute top-0 right-1 transform rotate-45">
            <View className="w-8 h-1 bg-blue-400" />
            <View className="w-1 h-3 bg-blue-400 absolute -top-2 right-0" />
          </View>
        </View>
      );
    }

    // Default return to avoid potential undefined returns
    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-500 w-full py-3 items-center">
        <Text className="text-white font-bold text-lg">TIMELAB™</Text>
      </View>

      {/* Tools Title */}
      <View className="p-6">
        <Text className="text-2xl font-bold text-black">Tools</Text>
      </View>

      {/* Tools Grid */}
      <View className="flex-row flex-wrap px-4 justify-between">
        {tools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            className="w-[45%] bg-blue-50 rounded-xl mb-6 p-4 items-center"
            activeOpacity={0.7}
          >
            {renderIcon(tool)}
            <Text className="text-center mt-2 font-medium text-lg">
              {tool.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
