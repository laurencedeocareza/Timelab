import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

export default function SplashScreenComponent({ navigation }: { navigation: any }) {
  useEffect(() => {
    async function loadResources() {
      try {
        await SplashScreen.preventAutoHideAsync();
        setTimeout(() => {
          navigation.replace('Index'); // Navigate to index.tsx
        }, 2000);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    loadResources();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/icon.png')} // ✅ Fixed path to icon
        style={styles.icon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  icon: {
    width: 150,
    height: 150,
    resizeMode: 'contain', // Ensure the icon fits properly
  },
});
