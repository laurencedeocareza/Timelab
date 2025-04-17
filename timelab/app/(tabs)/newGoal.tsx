import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  NewGoal: undefined;
  // add other screens here if needed
};

type NewGoalProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "NewGoal">;
};

type Category = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type CategoryItemProps = {
  category: Category;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isSelected,
  onSelect,
}) => (
  <TouchableOpacity
    style={tw`flex-1 items-center p-3 rounded-xl mr-2 ${
      isSelected ? "bg-purple-100 border border-purple-500" : "bg-gray-100"
    }`}
    onPress={() => onSelect(category.id)}
  >
    <Ionicons
      name={category.icon}
      size={24}
      color={isSelected ? "#a066cc" : "#777"}
    />
    <Text
      style={tw`mt-2 text-xs ${
        isSelected ? "text-purple-700 font-medium" : "text-gray-600"
      }`}
    >
      {category.name}
    </Text>
  </TouchableOpacity>
);

const NewGoal: React.FC<NewGoalProps> = ({ navigation }) => {
  const [goalName, setGoalName] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [duration, setDuration] = useState(1);

  const categories: Category[] = [
    { id: "SPORTING", name: "Sporting", icon: "fitness-outline" },
    { id: "ACADEMIC", name: "Academic", icon: "book-outline" },
    { id: "HEALTH", name: "Health", icon: "heart-outline" },
    { id: "FINANCE", name: "Finance", icon: "cash-outline" },
  ];

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-white`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={tw`flex-1`}>
        {/* Header */}
        <View style={tw`flex-row justify-between items-center px-4 pt-12 pb-4`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close-outline" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold`}>New Goal</Text>
          <TouchableOpacity>
            <Text style={tw`text-lg text-purple-600 font-medium`}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Form Content */}
        <View style={tw`px-4 py-4`}>
          {/* Goal Name */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
              Goal Name
            </Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 text-base`}
              placeholder="What do you want to achieve?"
              value={goalName}
              onChangeText={setGoalName}
            />
          </View>

          {/* Goal Description */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
              Description
            </Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 text-base h-24`}
              placeholder="Add more details about your goal"
              multiline
              value={goalDescription}
              onChangeText={setGoalDescription}
            />
          </View>

          {/* Category Selection */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
              Category
            </Text>
            <View style={tw`flex-row justify-between`}>
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.id}
                  onSelect={setSelectedCategory}
                />
              ))}
            </View>
          </View>

          {/* Goal Type */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
              Goal Type
            </Text>
            <View
              style={tw`flex-row border border-gray-300 rounded-lg overflow-hidden`}
            >
              <TouchableOpacity
                style={tw`flex-1 py-3 px-4 bg-purple-500 items-center`}
              >
                <Text style={tw`text-white font-medium`}>Weekly</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 py-3 px-4 bg-white items-center`}
              >
                <Text style={tw`text-gray-700`}>Daily</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 py-3 px-4 bg-white items-center`}
              >
                <Text style={tw`text-gray-700`}>One-time</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Duration */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
              Duration (weeks)
            </Text>
            <View
              style={tw`flex-row items-center border border-gray-300 rounded-lg p-2`}
            >
              <TouchableOpacity
                style={tw`w-10 h-10 items-center justify-center`}
                onPress={() => setDuration(Math.max(1, duration - 1))}
              >
                <Ionicons name="remove" size={24} color="#777" />
              </TouchableOpacity>
              <View style={tw`flex-1 items-center`}>
                <Text style={tw`text-lg font-medium`}>{duration}</Text>
              </View>
              <TouchableOpacity
                style={tw`w-10 h-10 items-center justify-center`}
                onPress={() => setDuration(duration + 1)}
              >
                <Ionicons name="add" size={24} color="#777" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Reminder */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
              Reminder
            </Text>
            <TouchableOpacity
              style={tw`flex-row justify-between items-center border border-gray-300 rounded-lg p-3`}
            >
              <Text style={tw`text-base text-gray-700`}>Set a reminder</Text>
              <Ionicons name="chevron-forward" size={20} color="#777" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Create Button */}
      <View style={tw`px-4 py-4 border-t border-gray-200`}>
        <TouchableOpacity
          style={tw`bg-purple-600 py-4 rounded-lg items-center`}
          onPress={() => navigation.goBack()}
        >
          <Text style={tw`text-white font-bold text-base`}>CREATE GOAL</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default NewGoal;
