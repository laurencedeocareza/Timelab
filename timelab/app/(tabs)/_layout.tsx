import { Tabs } from "expo-router";
<<<<<<< HEAD
import { Image } from "react-native";

export default function TabLayout() {
  return (
    <Tabs>
      {/* Home Tab */}
      <Tabs.Screen 
        name="index" 
        options={{
          title: "Home",
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
          title: "Methods",
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={require('../../assets/images/method.png')} 
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />

      {/* Tools Tab */}
      <Tabs.Screen 
        name="tools" 
        options={{
          title: "Tools",
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
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={require('../../assets/images/profile.png')} 
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
=======
import "../../global.css";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="Home" />
      <Tabs.Screen name="Tools" />
      <Tabs.Screen name="Index" />
      <Tabs.Screen name="Notes" />
      <Tabs.Screen name="Profile" />
>>>>>>> 31dc24bbd6c4f8e481af4472b86d36cd3cb9a41e
    </Tabs>
  );
}
