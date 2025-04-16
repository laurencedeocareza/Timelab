import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import tw from "tailwind-react-native-classnames";

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
  const renderBadge = (color: string, stars: number) => {
    const colorMap: Record<string, string> = {
      red: "bg-red-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
    };

    return (
      <View style={tw`items-center`}>
        <View
          style={tw`w-12 h-12 rounded-full ${colorMap[color]} flex items-center justify-center`}
        >
          {Array.from({ length: stars }).map((_, i) => (
            <Text key={i} style={tw`text-white text-xs`}>
              ★
            </Text>
          ))}
        </View>
      </View>
    );
  };

  // Render the special star badge
  const renderSpecialBadge = () => (
    <View style={tw`items-center`}>
      <View style={tw`w-12 h-12 rounded-full bg-red-500 flex items-center justify-center`}>
        <Text style={tw`text-white text-lg font-bold`}>★</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`py-6 bg-white shadow-md items-center`}>
        <Text style={tw`text-2xl font-bold text-gray-800`}>Profile</Text>
      </View>

      {/* Profile Picture */}
      <View style={tw`items-center mt-6`}>
        <View style={tw`w-24 h-24 rounded-full bg-gray-200 overflow-hidden`}>
          <Image
            source={require("../../assets/images/profile.png")} // Update this path
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
        </View>
        <Text style={tw`mt-4 text-lg font-bold text-gray-800`}>Juan Dela Cruz</Text>
        <Text style={tw`text-gray-500`}>Juan@Gmail.com</Text>
      </View>

      {/* Separator */}
      <View style={tw`h-px bg-gray-300 my-6 mx-6`} />

      {/* Action Buttons */}
      <View style={tw`px-6`}>
        <TouchableOpacity
          style={tw`bg-blue-500 py-3 rounded-lg items-center mb-4 shadow`}
        >
          <Text style={tw`text-white font-bold text-base`}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`bg-blue-500 py-3 rounded-lg items-center shadow`}
        >
          <Text style={tw`text-white font-bold text-base`}>Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* Separator */}
      <View style={tw`h-px bg-gray-300 my-6 mx-6`} />

      {/* Badges Section */}
      <View style={tw`px-6`}>
        <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Badges</Text>
        <View style={tw`flex-row flex-wrap justify-between`}>
          {badges.map((badge) => (
            <View key={badge.id} style={tw`w-[30%] mb-4 items-center`}>
              {badge.special
                ? renderSpecialBadge()
                : renderBadge(badge.color, "stars" in badge ? badge.stars : 3)}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
