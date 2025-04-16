import React, { useState, useLayoutEffect } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import tw from 'tailwind-react-native-classnames'; // Import Tailwind for styling

type RootStackParamList = {
  userAccount: undefined; // Define the userAccount route
};

const UserInfo = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Add type for navigation
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleSubmit = () => {
    navigation.navigate('userAccount'); // Directly navigate to the userAccount screen
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`w-full bg-blue-500 py-6 items-center shadow-md`}>
        <Text style={tw`text-white text-xl font-bold`}>Let Us Know You</Text>
      </View>

      {/* Main Content */}
      <View style={tw`flex-1 items-center px-6 py-8`}>
        {/* Icon */}
        <Image
          source={require('../assets/images/userInfoIcon.png')} // Replace with your icon path
          style={tw`w-28 h-28 mb-6`}
        />

        {/* Input Fields */}
        <TextInput
          style={tw`w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 bg-white text-base shadow-sm`}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={tw`w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 bg-white text-base shadow-sm`}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={tw`w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 bg-white text-base shadow-sm`}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={tw`bg-blue-500 py-3 px-8 rounded-full shadow-lg`}
          onPress={handleSubmit}
        >
          <Text style={tw`text-white text-lg font-bold`}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserInfo;