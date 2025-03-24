import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import tw from 'tailwind-react-native-classnames'; // For styling

const weeklyGoals = [
  { id: '1', name: 'Goal Name' },
  { id: '2', name: 'Goal Name' },
  { id: '3', name: 'Goal Name' },
];

const dailyGoals = [
  { id: '1', name: 'Goal Name', time: 'Due: 5:00 PM' },
  { id: '2', name: 'Goal Name', time: 'Due: 6:00 PM' },
  { id: '3', name: 'Goal Name', time: 'Due: 7:00 PM' },
];

const GoalPage = () => {
  return (
    <View style={tw`flex-1 bg-white`}>
     

      {/* Weekly Goals Section */}
      <Text style={tw`text-lg font-bold text-center mt-4 mb-2`}>Weekly Goals</Text>
      <FlatList
        data={weeklyGoals}
        horizontal
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`px-4`}
        renderItem={({ item }) => (
          <View style={tw`bg-blue-100 w-32 h-32 rounded-lg justify-center items-center mr-4`}>
            <Text style={tw`text-sm font-bold text-center`}>{item.name}</Text>
          </View>
        )}
      />

      {/* Daily Goals Section */}
      <Text style={tw`text-lg font-bold text-center mt-6 mb-2`}>Daily Goals</Text>
      <FlatList
        data={dailyGoals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`px-4`}
        renderItem={({ item }) => (
          <View style={tw`bg-blue-100 rounded-lg p-4 mb-4 flex-row justify-between items-center`}>
            <Text style={tw`text-sm font-bold`}>{item.name}</Text>
            <Text style={tw`text-xs text-gray-500`}>{item.time}</Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={20} color="gray" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* New Task Button */}
      <TouchableOpacity
        style={tw`bg-blue-500 py-3 px-10 rounded absolute bottom-8 self-center`}
        onPress={() => console.log('New Task pressed')}
      >
        <Text style={tw`text-white text-base font-bold`}>New Task</Text>
      </TouchableOpacity>

      
    </View>
  );
};

export default GoalPage;