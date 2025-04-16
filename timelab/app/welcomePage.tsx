import React, { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames"; // Import Tailwind for styling

const WelcomePage = () => {
  const navigation = useNavigation();

  // Hide the header dynamically
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleProceed = () => {
    navigation.navigate("(tabs)" as never); // Navigate to the (tabs) route
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={tw`flex-1 bg-gray-50 items-center justify-center px-6`}>
      {/* Welcome Text */}
      <Text style={tw`text-3xl font-bold text-blue-600 mb-6 text-center`}>
        Welcome to TimeLab!
      </Text>

      {/* Welcome Icon */}
      <Image
        source={require("../assets/images/helloIcon.png")} // Replace with your icon path
        style={tw`w-32 h-32 mb-6`}
      />

      {/* Description */}
      <Text style={tw`text-base text-center text-gray-700 mb-4`}>
        We're excited to have you on board. Start organizing your tasks, boost
        your focus, and unlock your productivity potential today.
      </Text>
      <Text style={tw`text-base text-center text-gray-700 mb-8`}>
        Let's make every moment count!
      </Text>

      {/* Proceed Button */}
      <TouchableOpacity
        style={tw`bg-blue-500 py-3 px-12 rounded-full shadow-lg mb-4`}
        onPress={handleProceed}
      >
        <Text style={tw`text-white text-lg font-bold`}>Proceed</Text>
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity
        onPress={handleBackPress}
        style={tw`absolute bottom-8 left-5 bg-gray-100 p-2 rounded-full shadow`}
      >
        <Image
          source={require("../assets/images/backbtn.png")} // Replace with your back button icon path
          style={tw`w-6 h-6`}
        />
      </TouchableOpacity>
    </View>
  );
};

export default WelcomePage;
