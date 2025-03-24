import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import tw from 'tailwind-react-native-classnames'; // Tailwind for styling

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

const notes: Note[] = [
  {
    id: '1',
    title: 'Grabe nga yon',
    content: 'asdfghjklasfagfgasfdadafafasdfa fafafadfasdfadfafadasfasfgagfas...',
    date: 'January 10, 2025',
  },
  {
    id: '2',
    title: 'Utang',
    content: '1. nel - 500\n2. lio - 69\n3. ses - 5,000 ...',
    date: 'January 9, 2025',
  },
  {
    id: '3',
    title: 'SDF',
    content: 'Human Resource Information System with Payroll',
    date: 'January 3, 2025',
  },
  {
    id: '4',
    title: 'Reminder',
    content: 'need matapos',
    date: 'January 3, 2025',
  },
];

const NotesPage = () => {
  const renderNote = ({ item }: { item: Note }) => (
    <View style={tw`bg-blue-100 rounded-lg p-4 mb-4`}>
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <Text style={tw`text-lg font-bold`}>{item.title}</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={tw`text-sm text-gray-700 mb-2`}>{item.content}</Text>
      <Text style={tw`text-xs text-gray-500 text-right`}>{item.date}</Text>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      
      {/* Notes Section */}
      <Text style={tw`text-xl font-bold text-center my-4`}>Notes</Text>
      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`px-4`}
      />
    </View>
  );
};

export default NotesPage;