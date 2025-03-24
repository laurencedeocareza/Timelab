import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames'; // Import Tailwind for styling

const WelcomePage = () => {
  const navigation = useNavigation();

  // Hide the header dynamically
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleProceed = () => {
    navigation.navigate('(tabs)' as never); // Navigate to the (tabs) route
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={tw`flex-1 items-center justify-center bg-blue-100 px-5`}>
      <Text style={tw`text-2xl font-bold text-blue-500 mb-5`}>WELCOME USER!</Text>
      <Image
        source={require('../assets/images/helloIcon.png')} // Replace with your icon path
        style={tw`w-24 h-24 mb-5`}
      />
      <Text style={tw`text-base text-center text-gray-700 mb-2`}>
        We're excited to have you on board. Start organizing your tasks, boost your focus and unlock your productivity potential today.
      </Text>
      <Text style={tw`text-base text-center text-gray-700 mb-5`}>
        Let's make every moment count!
      </Text>
      <TouchableOpacity style={tw`bg-blue-500 py-3 px-10 rounded`} onPress={handleProceed}>
        <Text style={tw`text-white text-base font-bold`}>PROCEED</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBackPress} style={tw`absolute bottom-8 left-5`}>
        <Image
          source={require('../assets/images/backbtn.png')} // Replace with your back button icon path
          style={tw`w-8 h-8`}
        />
      </TouchableOpacity>
    </View>
  );
};

export default WelcomePage;