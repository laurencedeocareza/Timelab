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
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`w-full bg-blue-500 py-4 items-center`}>
        <Text style={tw`text-white text-lg font-bold`}>LET US KNOW YOU</Text>
      </View>

      {/* Main Content */}
      <View style={tw`flex-1 items-center px-5 py-4`}>
        <Image
          source={require('../assets/images/userInfoIcon.png')} // Replace with your icon path
          style={tw`w-24 h-24 mb-5`}
        />
        <TextInput
          style={tw`w-full border border-gray-300 rounded px-3 py-2 mb-4 text-base`}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={tw`w-full border border-gray-300 rounded px-3 py-2 mb-4 text-base`}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={tw`w-full border border-gray-300 rounded px-3 py-2 mb-4 text-base`}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TouchableOpacity style={tw`bg-blue-500 py-2 px-6 rounded`} onPress={handleSubmit}>
          <Text style={tw`text-white text-base font-bold`}>Submit</Text>
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

export default UserInfo;