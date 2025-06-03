import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import tw from "tailwind-react-native-classnames";

export default function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null; // Use NodeJS.Timeout for compatibility
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60); // Reset to 25 minutes
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`py-6 justify-center items-center`}>
        <Text style={tw`text-2xl font-bold text-black`}>Pomodoro Timer</Text>
      </View>
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-6xl font-bold text-black`}>{formatTime(timeLeft)}</Text>
        <View style={tw`flex-row mt-6`}>
          <TouchableOpacity
            style={tw`bg-green-500 px-6 py-3 rounded-lg mx-2`}
            onPress={handleStartPause}
          >
            <Text style={tw`text-white text-lg font-bold`}>
              {isRunning ? "Pause" : "Start"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-red-500 px-6 py-3 rounded-lg mx-2`}
            onPress={handleReset}
          >
            <Text style={tw`text-white text-lg font-bold`}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}