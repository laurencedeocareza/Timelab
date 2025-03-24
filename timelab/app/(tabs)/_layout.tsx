import { Tabs } from "expo-router";
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
    </Tabs>
  );
}
