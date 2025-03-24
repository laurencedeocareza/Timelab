import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";

interface Task {
  id: number;
  name: string;
  duration: number;
  priority: string;
}

export default function Pomodoro() {
  // Initial timer state
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Task list
  const tasks: Task[] = [
    { id: 1, name: "task name", duration: 1500, priority: "High" },
    { id: 2, name: "task name", duration: 1500, priority: "High" },
    { id: 3, name: "task name", duration: 1500, priority: "High" },
  ];

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Toggle timer start/stop
  const toggleTimer = (): void => {
    setIsRunning(!isRunning);
  };

  // Calculate progress circle values
  const totalTime = 25 * 60;
  const percentage = (timeLeft / totalTime) * 100;

  // SVG circle parameters
  const size = 200;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);
  const center = size / 2;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with back button */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity className="p-2">
          <View className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center">
            <Text className="text-white font-bold">&lt;</Text>
          </View>
        </TouchableOpacity>
        <Text className="text-xl font-semibold ml-4">Pomodoro</Text>
      </View>

      {/* Timer Circle */}
      <View className="items-center justify-center py-10">
        <View className="relative w-52 h-52 items-center justify-center">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background Circle (Gray) */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#E5E5E5"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Progress Circle (Blue) */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#0096FF"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${center} ${center})`}
              strokeLinecap="round"
            />
          </svg>

          {/* Timer Text */}
          <Text className="absolute text-4xl font-bold">
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      {/* Tasks Header */}
      <Text className="text-xl font-semibold px-6 mb-2">Tasks</Text>

      {/* Tasks List */}
      <ScrollView className="px-6">
        {tasks.map((task) => (
          <View
            key={task.id}
            className="flex-row items-center bg-gray-200 rounded-lg p-4 mb-3"
          >
            <View className="h-6 w-6 rounded-full bg-gray-400 mr-3 items-center justify-center">
              <Text className="text-white text-xs">○</Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm">{task.name}</Text>
              <Text className="text-xs text-gray-500">
                {task.duration} mins
              </Text>
            </View>
            <View className="bg-red-500 px-3 py-1 rounded-md">
              <Text className="text-white text-xs font-medium">
                {task.priority}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Play Button */}
      <View className="items-center mb-8 mt-4">
        <TouchableOpacity
          onPress={toggleTimer}
          className="w-14 h-14 rounded-full bg-blue-500 items-center justify-center"
        >
          <Text className="text-white text-xl">{isRunning ? "❚❚" : "▶"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
