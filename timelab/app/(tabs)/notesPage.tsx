import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Grabe nga yon",
      content:
        "asdfghjklasfagfgasfdadafafasdfa fafafadfasdfadfafadasfasfgagfas...",
      date: "January 10, 2025",
    },
    {
      id: "2",
      title: "Utang",
      content: "1. nel - 500\n2. lio - 69\n3. ses - 5,000 ...",
      date: "January 9, 2025",
    },
    {
      id: "3",
      title: "SDF",
      content: "Human Resource Information System with Payroll",
      date: "January 3, 2025",
    },
    {
      id: "4",
      title: "Reminder",
      content: "need matapos",
      date: "January 3, 2025",
    },
  ]);

  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleAddNote = () => {
    if (!newNoteTitle.trim()) return;

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const newNote: Note = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: newNoteContent,
      date: formattedDate,
    };

    setNotes([newNote, ...notes]);
    setNewNoteTitle("");
    setNewNoteContent("");
    setIsAddingNote(false);
    Keyboard.dismiss();
  };

  const handleOptionsPress = (noteId: string) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };

  const handleEdit = (note: Note) => {
    Alert.alert("Edit Note", `Editing note: ${note.title}`);
  };

  const handleDelete = (note: Note) => {
    Alert.alert(
      "Delete Note",
      `Are you sure you want to delete "${note.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setNotes(notes.filter((n) => n.id !== note.id));
          },
        },
      ]
    );
  };

  const renderNote = ({ item }: { item: Note }) => (
    <View
      style={tw`bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm`}
    >
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <Text style={tw`text-lg font-bold text-gray-800`}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleOptionsPress(item.id)}>
          <Ionicons name="ellipsis-vertical" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <Text style={tw`text-sm text-gray-600 mb-2`}>{item.content}</Text>
      <Text style={tw`text-xs text-gray-400 text-right`}>{item.date}</Text>

      {expandedNoteId === item.id && (
        <View style={tw`mt-4 bg-gray-50 p-3 rounded-lg`}>
          <TouchableOpacity
            style={tw`py-2 flex-row items-center`}
            onPress={() => handleEdit(item)}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color="#3b82f6"
              style={tw`mr-2`}
            />
            <Text style={tw`text-blue-500 text-base`}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`py-2 flex-row items-center`}
            onPress={() => handleDelete(item)}
          >
            <Ionicons
              name="trash-outline"
              size={18}
              color="#ef4444"
              style={tw`mr-2`}
            />
            <Text style={tw`text-red-500 text-base`}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={tw`flex-1 bg-gray-50 p-4`}>
      <Text style={tw`text-2xl font-bold text-gray-800 mb-6`}>Notes</Text>

      {/* Add Note Button */}
      {!isAddingNote && (
        <TouchableOpacity
          style={tw`bg-blue-500 py-3 px-4 rounded-lg mb-4 flex-row items-center justify-center`}
          onPress={() => setIsAddingNote(true)}
        >
          <Ionicons name="add" size={20} color="white" style={tw`mr-2`} />
          <Text style={tw`text-white font-medium`}>Add New Note</Text>
        </TouchableOpacity>
      )}

      {/* Add Note Form */}
      {isAddingNote && (
        <View style={tw`bg-white p-4 rounded-lg shadow-md mb-4`}>
          <TextInput
            style={tw`border-b border-gray-200 pb-2 mb-4 text-lg font-medium`}
            placeholder="Note title"
            value={newNoteTitle}
            onChangeText={setNewNoteTitle}
            autoFocus
          />
          <TextInput
            style={tw`border-b border-gray-200 pb-2 mb-4 text-base`}
            placeholder="Note content"
            multiline
            value={newNoteContent}
            onChangeText={setNewNoteContent}
          />
          <View style={tw`flex-row justify-end`}>
            <TouchableOpacity
              style={tw`px-4 py-2 mr-2`}
              onPress={() => {
                setIsAddingNote(false);
                setNewNoteTitle("");
                setNewNoteContent("");
              }}
            >
              <Text style={tw`text-gray-500`}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-blue-500 px-4 py-2 rounded-lg`}
              onPress={handleAddNote}
            >
              <Text style={tw`text-white`}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Notes List */}
      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`pb-20`}
      />
    </View>
  );
};

export default NotesPage;
