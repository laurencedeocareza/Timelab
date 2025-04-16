import React, { useState, useLayoutEffect } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import tw from 'tailwind-react-native-classnames'; // Import Tailwind for styling

type RootStackParamList = {
  welcomePage: undefined; // Define the route and its parameters
};

const UserAccount = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Add type for navigation
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleSignUp = () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (!isChecked) {
      Alert.alert('Error', 'You must agree to the Terms and Conditions.');
      return;
    }
    navigation.navigate('welcomePage'); // Directly navigate to the welcomePage
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`w-full bg-blue-500 py-6 items-center shadow-md`}>
        <Text style={tw`text-white text-xl font-bold`}>Set Up Your Account</Text>
      </View>

      {/* Main Content */}
      <View style={tw`flex-1 items-center px-6 py-8`}>
        {/* Icon */}
        <Image
          source={require('../assets/images/userAcc.png')} // Replace with your icon path
          style={tw`w-28 h-28 mb-6`}
        />

        {/* Input Fields */}
        <TextInput
          style={tw`w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 bg-white text-base shadow-sm`}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={tw`w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 bg-white text-base shadow-sm`}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={tw`w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 bg-white text-base shadow-sm`}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* Terms and Conditions */}
        <View style={tw`flex-row items-center mb-6`}>
          <TouchableOpacity
            style={tw`w-5 h-5 border border-gray-300 rounded justify-center items-center`}
            onPress={() => setIsChecked(!isChecked)}
          >
            <View style={isChecked ? tw`w-3.5 h-3.5 bg-blue-500` : tw`w-3.5 h-3.5`} />
          </TouchableOpacity>
          <Text style={tw`ml-2 text-sm text-gray-700`}>
            I agree to the Timelab T&C.{' '}
            <Text style={tw`text-blue-500 underline`}>Read here</Text>
          </Text>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={tw`bg-blue-500 py-3 px-8 rounded-full shadow-lg`}
          onPress={handleSignUp}
        >
          <Text style={tw`text-white text-lg font-bold`}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={tw`absolute bottom-8 left-5 bg-gray-100 p-2 rounded-full shadow`}
        onPress={() => navigation.goBack()} // Navigates back to the previous screen
      >
        <Image
          source={require('../assets/images/backbtn.png')} // Replace with your back button icon path
          style={tw`w-6 h-6`}
        />
      </TouchableOpacity>
    </View>
  );
};

export default UserAccount;