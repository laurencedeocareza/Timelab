import React, { useState, useLayoutEffect } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import tw from 'tailwind-react-native-classnames'; // Import Tailwind for styling

type RootStackParamList = {
  welcomePage: undefined; // Define the route and its parameters
};

const UserAccount = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Add type for navigation
  // const navigation = useNavigation(); // Initialize navigation (removed duplicate)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleSignUp = () => {
    navigation.navigate('welcomePage'); // Directly navigate to the welcomePage
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`w-full bg-blue-500 py-4 items-center`}>
        <Text style={tw`text-white text-lg font-bold`}>SET UP YOUR ACCOUNT</Text>
      </View>

      {/* Main Content */}
      <View style={tw`flex-1 items-center px-5 py-4`}>
        <Image
          source={require('../assets/images/userAcc.png')} // Replace with your icon path
          style={tw`w-24 h-24 mb-5`}
        />
        <TextInput
          style={tw`w-full border border-gray-300 rounded px-3 py-2 mb-4 text-base`}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={tw`w-full border border-gray-300 rounded px-3 py-2 mb-4 text-base`}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={tw`w-full border border-gray-300 rounded px-3 py-2 mb-4 text-base`}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <View style={tw`flex-row items-center mb-4`}>
          <TouchableOpacity
            style={tw`w-5 h-5 border border-gray-300 rounded justify-center items-center`}
            onPress={() => setIsChecked(!isChecked)}
          >
            <View style={isChecked ? tw`w-3.5 h-3.5 bg-blue-500` : tw`w-3.5 h-3.5`} />
          </TouchableOpacity>
          <Text style={tw`ml-2 text-sm text-gray-700`}>
            I agree to the Timelab T&C. <Text style={tw`text-blue-500 underline`}>Read here</Text>
          </Text>
        </View>
        <TouchableOpacity style={tw`bg-blue-500 py-2 px-6 rounded`} onPress={handleSignUp}>
          <Text style={tw`text-white text-base font-bold`}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Back Button */}
      <TouchableOpacity style={tw`absolute bottom-8 left-5`} onPress={() => navigation.goBack()}>
        <Image
          source={require('../assets/images/backbtn.png')} // Replace with your back button icon path
          style={tw`w-8 h-8`}
        />
      </TouchableOpacity>
    </View>
  );
};

export default UserAccount;