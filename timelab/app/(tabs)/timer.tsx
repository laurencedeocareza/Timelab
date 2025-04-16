import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import tw from "tailwind-react-native-classnames";

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Animate progress
  useEffect(() => {
    const progress = 1 - timeLeft / (25 * 60);
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={tw`flex-1 bg-gray-50 p-6`}>
      {/* Header */}
      <Text style={tw`text-2xl font-bold text-center text-gray-800 mb-8`}>
        Pomodoro Timer
      </Text>

      {/* Timer Display */}
      <View style={tw`items-center justify-center mb-8`}>
        <View
          style={tw`w-48 h-48 rounded-full bg-gray-200 relative items-center justify-center`}
        >
          <Animated.View
            style={[
              tw`absolute w-48 h-48 rounded-full border-4 border-blue-500`,
              {
                transform: [
                  {
                    rotate: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          />
          <Text style={tw`absolute text-4xl font-light text-gray-800`}>
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      {/* Tasks Section */}
      <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Tasks</Text>
      <View style={tw`border-t border-gray-300`}>
        {/* Tasks will be dynamically added here in the future */}
      </View>

      {/* Control Button */}
      <TouchableOpacity
        style={tw`bg-blue-500 py-4 rounded-lg mt-8 shadow-lg`}
        onPress={() => setIsRunning(!isRunning)}
      >
        <Text style={tw`text-white text-center text-lg font-bold`}>
          {isRunning ? "PAUSE" : "START"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
