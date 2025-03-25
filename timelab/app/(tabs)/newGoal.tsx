import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For icons
import tw from "tailwind-react-native-classnames"; // For styling

const NewGoal = () => {
  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Main Content */}
      <View style={tw`flex-1 items-center justify-top`}>
        <Text style={tw`text-lg font-bold`}>New Goal</Text>
      </View>
    </View>
  );
};

export default NewGoal;
