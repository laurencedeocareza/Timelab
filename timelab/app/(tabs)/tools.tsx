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
import { useRouter } from "expo-router";

interface Tool {
  id: number;
  title: string;
  icon: string;
  iconType: string;
  colors: string[];
  route?: string; // Add route property
}

export default function Tools() {
  const router = useRouter();

  const tools: Tool[] = [
    {
      id: 1,
      title: "Methods",
      icon: "methods",
      iconType: "image",
      colors: ["bg-blue-100", "bg-blue-200"],
      route: "/methods", // Route to methods.tsx file
    },
    {
      id: 2,
      title: "Sleep Timer",
      icon: "moon",
      iconType: "FontAwesome5",
      colors: ["bg-green-100", "bg-green-200"],
    },
    {
      id: 3,
      title: "Sounds",
      icon: "wave-square",
      iconType: "FontAwesome5",
      colors: ["bg-yellow-100", "bg-yellow-200"],
    },
    {
      id: 4,
      title: "Goals",
      icon: "goals",
      iconType: "image",
      colors: ["bg-purple-100", "bg-purple-200"],
      route: "/goalPage",
    },
  ];

  // Add navigation handler
  const handleToolPress = (tool: Tool) => {
    if (tool.route) {
      console.log("Navigating to:", tool.route);
      router.push(tool.route as any);
    }
  };

  const renderIcon = (tool: Tool) => {
    if (tool.id === 1) {
      return (
        <View style={tw`w-12 h-12 items-center justify-center`}>
          <Image
            source={require("../../assets/images/methods.png")}
            style={tw`w-10 h-10`}
            resizeMode="contain"
          />
        </View>
      );
    } else if (tool.id === 2) {
      return (
        <View
          style={tw`w-12 h-12 bg-yellow-400 rounded-full items-center justify-center`}
        >
          <View style={tw`absolute right-1 top-1`}>
            <Text style={tw`text-blue-400 text-sm font-bold`}>z</Text>
            <Text style={tw`text-blue-400 text-lg font-bold ml-2`}>z</Text>
            <Text style={tw`text-blue-400 text-sm font-bold`}>z</Text>
          </View>
        </View>
      );
    } else if (tool.id === 3) {
      return (
        <View style={tw`flex-row items-center justify-center`}>
          <View style={tw`w-1.5 h-6 bg-pink-400 rounded mx-0.5`} />
          <View style={tw`w-1.5 h-8 bg-pink-500 rounded mx-0.5`} />
          <View style={tw`w-1.5 h-4 bg-purple-400 rounded mx-0.5`} />
          <View style={tw`w-1.5 h-7 bg-purple-500 rounded mx-0.5`} />
          <View style={tw`w-1.5 h-5 bg-pink-400 rounded mx-0.5`} />
        </View>
      );
    } else if (tool.id === 4) {
      return (
        <View style={tw`w-12 h-12 items-center justify-center`}>
          <Image
            source={require("../../assets/images/goals.png")}
            style={tw`w-10 h-10`}
            resizeMode="contain"
          />
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`py-6 items-center`}>
        <Text style={tw`text-2xl font-bold text-black`}>Tools</Text>
      </View>

      {/* Tools Grid */}
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
            onPress={() => handleToolPress(tool)} // Add navigation handler
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
