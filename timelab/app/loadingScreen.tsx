import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter


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
        styles.container,
        { backgroundColor: interpolatedBackgroundColor },
      ]}
    >
      <Animated.Image
        source={require('../assets/images/timeLabLogo.png')} // Replace with your logo path
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale }],
          },
        ]}
      />
      <Animated.View style={{ opacity: buttonOpacity }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/userInfo')} // Navigate to the userInfo page
        >
          <Text style={styles.buttonText}>Get Started!</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF', // Adjust to match your design
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoadingScreen;