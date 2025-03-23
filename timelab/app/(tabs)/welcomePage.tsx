import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomePage = () => {
  const navigation = useNavigation();

  // Hide the header dynamically
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WELCOME USER!</Text>
      <Image source={require('../../assets/images/helloIcon.png')} style={styles.icon} />
      <Text style={styles.description}>
        We're excited to have you on board. Start organizing your tasks, boost your focus and unlock your productivity potential today.
      </Text>
      <Text style={styles.description}>Let's make every moment count!</Text>
      <TouchableOpacity style={styles.proceedButton}>
        <Text style={styles.proceedText}>PROCEED</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Image source={require('../../assets/images/backbtn.png')} style={styles.backIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF6FF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 20,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  proceedButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 20,
  },
  proceedText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
});

export default WelcomePage;