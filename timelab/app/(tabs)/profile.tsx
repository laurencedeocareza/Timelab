import React, { useState, useEffect } from "react";
import { auth } from "../../FirebaseConfig";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { Ionicons } from "@expo/vector-icons";
import { userService } from "../../lib/userService";
import { taskService, Task } from "../../lib/taskService";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  userProfile: any;
  onProfileUpdated: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  userProfile,
  onProfileUpdated,
}) => {
  const [fullName, setFullName] = useState(userProfile?.fullName || "");
  const [email, setEmail] = useState(userProfile?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName || "");
      setEmail(userProfile.email || "");
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }

    setLoading(true);
    try {
      // Update profile name
      await userService.updateUserProfileName(fullName.trim());

      // Update email if changed
      if (email !== userProfile?.email && currentPassword) {
        await userService.updateUserEmail(email, currentPassword);
      }

      // Update password if provided
      if (newPassword && currentPassword) {
        await userService.updateUserPassword(currentPassword, newPassword);
      }

      Alert.alert("Success", "Profile updated successfully!");
      onProfileUpdated();
      onClose();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={tw`flex-1 bg-white`}>
        <View
          style={tw`flex-row items-center justify-between p-4 border-b border-gray-200`}
        >
          <TouchableOpacity onPress={onClose}>
            <Text style={tw`text-blue-500 text-lg`}>Cancel</Text>
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold`}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} disabled={loading}>
            <Text
              style={tw`text-blue-500 text-lg ${loading ? "opacity-50" : ""}`}
            >
              {loading ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={tw`flex-1 p-4`}>
          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-700 font-medium mb-2`}>Full Name</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 text-base`}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
            />
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-700 font-medium mb-2`}>Email</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 text-base`}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-700 font-medium mb-2`}>
              Current Password
            </Text>
            <Text style={tw`text-gray-500 text-sm mb-2`}>
              Required for email/password changes
            </Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 text-base`}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              secureTextEntry
            />
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-700 font-medium mb-2`}>
              New Password (Optional)
            </Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 text-base`}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default function Profile() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();

  const loadUserData = async () => {
    try {
      const [profile, userTasks] = await Promise.all([
        userService.getCurrentUserProfile(),
        taskService.getUserTasks(),
      ]);

      setUserProfile(profile);
      setTasks(userTasks);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <Text style={tw`text-gray-600`}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  const activeTasks = tasks.filter((task) => task.status !== "completed");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Navigate to login screen
      router.replace("/userInfo");
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView>
        {/* Profile Header */}
        <View style={[tw`px-4 pt-6 pb-6`, { backgroundColor: "#0098da" }]}>
          <View style={tw`items-center`}>
            <View
              style={tw`w-24 h-24 rounded-full bg-white bg-opacity-20 items-center justify-center`}
            >
              <Text style={tw`text-3xl font-bold text-white`}>
                {userProfile?.fullName?.charAt(0) || "U"}
              </Text>
            </View>
            <Text style={tw`mt-4 text-xl font-bold text-white`}>
              {userProfile?.fullName || "User"}
            </Text>
            <Text style={tw`text-white text-sm opacity-80`}>
              {userProfile?.email || "No email"}
            </Text>
          </View>

          {/* Stats */}
          <View style={tw`flex-row justify-between mt-6`}>
            <View style={tw`items-center`}>
              <Text style={tw`text-white font-bold text-xl`}>
                {tasks.length}
              </Text>
              <Text style={tw`text-white text-xs uppercase`}>Total Tasks</Text>
            </View>
            <View style={tw`items-center`}>
              <Text style={tw`text-white font-bold text-xl`}>
                {activeTasks.length}
              </Text>
              <Text style={tw`text-white text-xs uppercase`}>Active Tasks</Text>
            </View>
            <View style={tw`items-center`}>
              <Text style={tw`text-white font-bold text-xl`}>
                {completedTasks.length}
              </Text>
              <Text style={tw`text-white text-xs uppercase`}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Content Container */}
        <View style={tw`bg-white rounded-t-3xl px-4 pt-6 -mt-4`}>
          {/* Edit Profile Button */}
          <View style={tw`mb-6`}>
            <TouchableOpacity
              style={tw`bg-blue-500 py-3 rounded-lg items-center shadow`}
              onPress={() => setShowEditModal(true)}
            >
              <Text style={tw`text-white font-bold text-base`}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>

          {/* Logout Button - Add this */}
          <View style={tw`mb-6`}>
            <TouchableOpacity
              style={tw`bg-red-500 py-3 rounded-lg items-center shadow`}
              onPress={handleLogout}
            >
              <Text style={tw`text-white font-bold text-base`}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Active Tasks Section */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-gray-800 font-bold text-lg mb-4`}>
              Active Tasks
            </Text>
            {activeTasks.length === 0 ? (
              <Text style={tw`text-gray-500 text-center py-4`}>
                No active tasks
              </Text>
            ) : (
              activeTasks.map((task) => (
                <View
                  key={task.id}
                  style={tw`flex-row items-center mb-4 bg-gray-50 p-3 rounded-lg`}
                >
                  <View
                    style={tw`bg-orange-500 w-8 h-8 rounded-full items-center justify-center mr-3`}
                  >
                    <Ionicons name="time" size={16} color="white" />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-gray-800 font-medium`}>
                      {task.title}
                    </Text>
                    <Text style={tw`text-gray-500 text-sm`}>
                      {task.totalSubtasks - task.completedSubtasks}/
                      {task.totalSubtasks} tasks left
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* History Section */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-gray-800 font-bold text-lg mb-4`}>
              History
            </Text>
            {completedTasks.length === 0 ? (
              <Text style={tw`text-gray-500 text-center py-4`}>
                No completed tasks
              </Text>
            ) : (
              completedTasks.map((task) => (
                <View
                  key={task.id}
                  style={tw`mb-4 border-b border-gray-100 pb-4`}
                >
                  <View style={tw`flex-row items-center mb-2`}>
                    <View
                      style={tw`bg-green-500 w-8 h-8 rounded-full items-center justify-center mr-3`}
                    >
                      <Ionicons name="checkmark" size={16} color="white" />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-gray-800 font-medium`}>
                        {task.title}
                      </Text>
                      <Text style={tw`text-gray-500 text-sm`}>
                        {task.completedSubtasks}/{task.totalSubtasks} completed
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        userProfile={userProfile}
        onProfileUpdated={loadUserData}
      />
    </SafeAreaView>
  );
}
