import { Tabs } from "expo-router";
import { Image, View } from "react-native";
import "../../global.css";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false, // Hide header with tab names
      tabBarShowLabel: false // Hide labels below icons
    }}>
      {/* Home Tab */}
      <Tabs.Screen 
        name="index" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={require('../../assets/images/home.png')} 
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />

      {/* Methods Tab */}
      <Tabs.Screen 
        name="methods" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={require('../../assets/images/method.png')} 
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />

      {/* Custom Tab with Custom Plus Icon */}
      <Tabs.Screen 
        name="custom" 
        options={{
          tabBarIcon: () => (
            <View style={{ 
              backgroundColor: '#3B82F6', // Blue background
              borderRadius: 30,
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 5
            }}>
              {/* Horizontal line of the plus */}
              <View style={{
                width: 22,
                height: 3,
                backgroundColor: 'white',
                position: 'absolute'
              }} />
              
              {/* Vertical line of the plus */}
              <View style={{
                width: 3,
                height: 22,
                backgroundColor: 'white',
                position: 'absolute'
              }} />
            </View>
          ),
        }}
      />

      {/* Tools Tab */}
      <Tabs.Screen 
        name="tools" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={require('../../assets/images/tools.png')} 
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen 
        name="profile" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={require('../../assets/images/profile.png')} 
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
