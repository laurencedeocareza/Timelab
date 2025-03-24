import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, Animated, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter
import tw from 'tailwind-react-native-classnames'; // Import Tailwind for styling

const LoadingScreen = () => {
  const router = useRouter(); // Initialize router
  const backgroundColor = useRef(new Animated.Value(0)).current; // For background color transition
  const logoOpacity = useRef(new Animated.Value(0)).current; // For logo fade-in
  const textOpacity = useRef(new Animated.Value(0)).current; // For text fade-in
  const scale = useRef(new Animated.Value(0.8)).current; // For scaling effect
  const buttonOpacity = useRef(new Animated.Value(0)).current; // For button fade-in
  const navigation = useNavigation();

  // Hide the header dynamically
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Step 1: Fade in the logo
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Step 2: Fade in the text
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Step 3: Scale up the logo and text
      Animated.timing(scale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Step 4: Transition background to white
      Animated.timing(backgroundColor, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false, // Background color animation requires non-native driver
      }),
      // Step 5: Fade in the button
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Interpolating background color from black to white
  const interpolatedBackgroundColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000000', '#FFFFFF'],
  });

  return (
    <Animated.View
      style={[
        tw`flex-1 justify-center items-center`,
        { backgroundColor: interpolatedBackgroundColor },
      ]}
    >
      <Animated.Image
        source={require('../assets/images/timeLabLogo.png')} // Replace with your logo path
        style={[
          tw`mb-2`,
          {
            width: 350, // Tailwind doesn't support dynamic width/height directly
            height: 350,
            opacity: logoOpacity,
            transform: [{ scale }],
          },
        ]}
      />
      <Animated.View style={{ opacity: buttonOpacity }}>
        <TouchableOpacity
          style={tw`bg-blue-500 py-2 px-6 rounded`}
          onPress={() => router.push('/userInfo')} // Navigate to the userInfo page
        >
          <Text style={tw`text-white text-base font-bold`}>Get Started!</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default LoadingScreen;