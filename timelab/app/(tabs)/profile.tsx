import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";

<<<<<<< HEAD
export default function profile() {
  return (
    <View>
      <Text>Profile</Text>
=======
// Define badge types for type safety
interface RegularBadge {
  id: number;
  color: string;
  stars: number;
  special?: false;
}

interface SpecialBadge {
  id: number;
  color: string;
  special: true;
}

type Badge = RegularBadge | SpecialBadge;

export default function Profile() {
  // Badge data for the badges section
  const badges: Badge[] = [
    { id: 1, color: "red", stars: 3 },
    { id: 2, color: "purple", stars: 3 },
    { id: 3, color: "orange", stars: 3 },
    { id: 4, color: "blue", stars: 4 },
    { id: 5, color: "green", stars: 3 },
    { id: 6, color: "red", special: true },
  ];

  // Render a regular badge with stars
  const renderBadge = (color: string, stars: number) => (
    <View className="items-center justify-center w-12 h-12">
      <View className="w-10 h-10 bg-gray-800 items-center justify-center rounded-lg">
        {Array.from({ length: stars }).map((_, i) => (
          <View
            key={i}
            className="w-1.5 h-1.5 bg-yellow-300 rounded-full absolute"
            style={{
              top: 3 + i * 4,
              left: i % 2 === 0 ? 3 : 7,
            }}
          />
        ))}
      </View>
      <View className={`w-4 h-6 bg-${color}-500 absolute -bottom-2`} />
>>>>>>> 31dc24bbd6c4f8e481af4472b86d36cd3cb9a41e
    </View>
  );

  // Render the special star badge
  const renderSpecialBadge = () => (
    <View className="items-center justify-center w-12 h-12">
      <View className="w-10 h-10 bg-red-500 rounded-full items-center justify-center">
        <View className="w-8 h-8 bg-yellow-500 rounded-full items-center justify-center">
          <Text className="text-white text-lg font-bold">★</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Tools Title */}
      <View className="p-6 justify-center items-center">
        <Text className="text-2xl font-bold text-black">Methods</Text>

        {/* Profile Picture */}
        <View className="mt-2 w-20 h-20 border border-gray-300 items-center justify-center">
          <View className="w-12 h-12 bg-blue-400 rounded-full" />
          <View className="w-16 h-8 bg-blue-500 rounded-full absolute bottom-0" />
        </View>
      </View>

      {/* Separator Line */}
      <View className="border-t border-gray-300 mt-4 mx-6" />

      {/* Profile Details */}
      <View className="mx-6 mt-4">
        <View className="flex-row items-center mb-3">
          <Text className="font-bold text-base">Full Name:</Text>
          <Text className="ml-2 text-base">Juan Dela Cruz</Text>
        </View>

        <View className="flex-row items-center mb-3">
          <Text className="font-bold text-base">Email:</Text>
          <Text className="ml-10 text-base">Juan@Gmail.com</Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity className="bg-blue-500 rounded-full py-2 items-center mt-2 mb-3">
          <Text className="text-white font-medium">Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-blue-500 rounded-full py-2 items-center mb-2">
          <Text className="text-white font-medium">Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* Separator Line */}
      <View className="border-t border-gray-300 mt-2 mx-6" />

      {/* Badges Section */}
      <View className="mx-6 mt-4">
        <Text className="text-center font-bold text-base mb-4">Badges</Text>

        <View className="flex-row flex-wrap justify-around">
          {badges.map((badge) => (
            <View key={badge.id} className="mb-4">
              {
                badge.special
                  ? renderSpecialBadge()
                  : renderBadge(badge.color, "stars" in badge ? badge.stars : 3) // Provide a default or check if stars exists
              }
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
