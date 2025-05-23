import type React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";

// Component Types
interface HistoryItemProps {
  title: string;
  timestamp: string;
  profileImage: any;
  userName: string;
}

interface ActiveTaskItemProps {
  title: string;
  completed: boolean;
  dueDate: string;
}

interface ProfileHeaderProps {
  name: string;
  email: string;
  profileImage: any;
  goals: number;
  activeTasks: number;
  finished: number;
}

interface SectionHeaderProps {
  title: string;
}

// Reusable Components (defined within the same file)
const HistoryItem: React.FC<HistoryItemProps> = ({
  title,
  timestamp,
  profileImage,
  userName,
}) => {
  return (
    <View style={tw`mb-4 border-b border-gray-100 pb-4`}>
      <View style={tw`flex-row items-center mb-2`}>
        <Image
          source={profileImage}
          style={tw`w-10 h-10 rounded-full`}
          resizeMode="cover"
        />
        <View style={tw`ml-3`}>
          <Text style={tw`text-gray-800 font-medium`}>{userName}</Text>
          <Text style={tw`text-gray-500 text-xs`}>{timestamp}</Text>
        </View>
      </View>
      <Text style={tw`text-gray-800 mb-2`}>{title}</Text>
    </View>
  );
};

const ActiveTaskItem: React.FC<ActiveTaskItemProps> = ({
  title,
  completed,
  dueDate,
}) => {
  return (
    <View style={tw`flex-row items-center mb-4 bg-gray-50 p-3 rounded-lg`}>
      <View
        style={tw`${
          completed ? "bg-green-500" : "bg-gray-300"
        } w-8 h-8 rounded-full items-center justify-center mr-3`}
      >
        {completed && <Text style={tw`text-white font-bold`}>✓</Text>}
      </View>
      <View style={tw`flex-1`}>
        <Text style={tw`text-gray-800 font-medium`}>{title}</Text>
        <View style={tw`flex-row items-center mt-1`}>
          <Text style={tw`text-gray-500 text-xs`}>⏱ {dueDate}</Text>
        </View>
      </View>
    </View>
  );
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  profileImage,
  goals,
  activeTasks,
  finished,
}) => {
  return (
    <View style={[tw`px-4 pt-6 pb-6`, { backgroundColor: "#0098da" }]}>
      {/* Profile Picture and Info */}
      <View style={tw`items-center`}>
        <View
          style={tw`w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-2 border-white`}
        >
          <Image
            source={profileImage}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
        </View>
        <Text style={tw`mt-4 text-xl font-bold text-white`}>{name}</Text>
        <Text style={tw`text-white text-sm opacity-80`}>{email}</Text>
      </View>

      {/* Stats */}
      <View style={tw`flex-row justify-between mt-6`}>
        <View style={tw`items-center`}>
          <Text style={tw`text-white font-bold text-xl`}>{goals}</Text>
          <Text style={tw`text-white text-xs uppercase`}>Goals</Text>
        </View>
        <View style={tw`items-center`}>
          <Text style={tw`text-white font-bold text-xl`}>{activeTasks}</Text>
          <Text style={tw`text-white text-xs uppercase`}>Active Tasks</Text>
        </View>
        <View style={tw`items-center`}>
          <Text style={tw`text-white font-bold text-xl`}>{finished}</Text>
          <Text style={tw`text-white text-xs uppercase`}>Finished Tasks</Text>
        </View>
      </View>
    </View>
  );
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return <Text style={tw`text-gray-800 font-bold text-lg mb-4`}>{title}</Text>;
};

// Main Profile Component
export default function Profile() {
  const navigation = useNavigation<any>(); // <-- Fix: add <any>

  // Sample data for active tasks
  const activeTasks = [
    {
      id: 1,
      title: "Complete 10km run",
      completed: false,
      dueDate: "Tomorrow",
    },
    { id: 2, title: "Cycling training", completed: true, dueDate: "Today" },
    { id: 3, title: "Mountain trail", completed: false, dueDate: "Next week" },
  ];

  // Sample data for history
  const historyData = [
    {
      id: 1,
      title: "Cycled",
      timestamp: "2 days ago",
    },
    {
      id: 2,
      title: "Reported closure",
      timestamp: "3 days ago",
    },
    {
      id: 3,
      title: "Completed trail",
      timestamp: "5 days ago",
    },
  ];

  const profileImage = require("../../assets/images/profile.png");

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView>
        {/* Profile Header Component */}
        <ProfileHeader
          name="Louis Saville"
          email="louis@example.com"
          profileImage={profileImage}
          goals={3420}
          activeTasks={461}
          finished={348}
        />

        {/* Content Container */}
        <View style={tw`bg-white rounded-t-3xl px-4 pt-6 -mt-4`}>
          {/* Action Buttons */}
          <View style={tw`mb-6`}>
            <TouchableOpacity
              style={tw`bg-blue-500 py-3 rounded-lg items-center mb-4 shadow`}
            >
              <Text style={tw`text-white font-bold text-base`}>
                Edit Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-blue-500 py-3 rounded-lg items-center shadow mb-4`}
            >
              <Text style={tw`text-white font-bold text-base`}>
                Change Password
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-blue-500 py-3 rounded-lg items-center shadow`}
              onPress={() => navigation.navigate("userInfo")} // <-- Add this handler
            >
              <Text style={tw`text-white font-bold text-base`}>
                Change Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Active Tasks Section */}
          <View style={tw`mb-6`}>
            <SectionHeader title="Active Tasks" />
            {activeTasks.map((task) => (
              <ActiveTaskItem
                key={task.id}
                title={task.title}
                completed={task.completed}
                dueDate={task.dueDate}
              />
            ))}
          </View>

          {/* History Section */}
          <View style={tw`mb-6`}>
            <SectionHeader title="History" />
            {historyData.map((item) => (
              <HistoryItem
                key={item.id}
                title={item.title}
                timestamp={item.timestamp}
                profileImage={profileImage}
                userName="Louis Saville"
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
