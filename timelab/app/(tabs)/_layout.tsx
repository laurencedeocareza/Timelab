import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
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
    </Tabs>
  );
}
