import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import tw from "tailwind-react-native-classnames";

type Task = {
  id: string;
  name: string;
  duration: number; // in minutes
  priority: "Low" | "Medium" | "High";
};

export default function TimerCreationScreen() {
  const [currentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", name: "Rest", duration: 3, priority: "High" },
  ]);
  const [showTaskPopup, setShowTaskPopup] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    name: "",
    duration: 0,
    priority: "Medium",
  });

  const handleAddTask = () => {
    if (newTask.name.trim()) {
      setTasks([...tasks, { ...newTask, id: Date.now().toString() }]);
      setNewTask({ name: "", duration: 0, priority: "Medium" });
      setShowTaskPopup(false);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleSubmit = () => {
    console.log("Tasks submitted:", tasks);
    // Add any additional logic for submitting tasks here
  };

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    const calendarDays: number[][] = [];
    let week: number[] = [];

    // Add previous month's days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      week.push(daysInPrevMonth - i);
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      if (week.length === 7) {
        calendarDays.push(week);
        week = [];
      }
      week.push(day);
    }

    // Add next month's days to fill the last week
    let nextMonthDay = 1;
    while (week.length < 7) {
      week.push(nextMonthDay++);
    }
    calendarDays.push(week);

    return calendarDays;
  };

  const calendarDays = getCalendarDays();
  const today = currentDate.getDate();

  return (
    <ScrollView style={tw`flex-1 p-4 bg-gray-50`}>
      {/* Calendar Section */}
      <Text style={tw`text-2xl font-bold mb-6 text-center text-gray-800`}>
        {currentDate.toLocaleString("default", { month: "long" })}{" "}
        {currentDate.getFullYear()}
      </Text>

      {/* Week Days Header */}
      <View style={tw`flex-row justify-between mb-4`}>
        {weekDays.map((day) => (
          <Text
            key={day}
            style={tw`w-10 text-center font-medium text-gray-500`}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Days Grid */}
      {calendarDays.map((week, weekIndex) => (
        <View key={weekIndex} style={tw`flex-row justify-between mb-2`}>
          {week.map((day, dayIndex) => (
            <View
              key={dayIndex}
              style={tw`w-10 h-10 justify-center items-center rounded-lg ${
                day === today
                  ? "bg-blue-500"
                  : weekIndex === 0 && day > 7
                  ? "bg-gray-200"
                  : weekIndex === calendarDays.length - 1 && day < 7
                  ? "bg-gray-200"
                  : "bg-blue-100"
              }`}
            >
              <Text
                style={
                  day === today
                    ? tw`text-white font-bold`
                    : weekIndex === 0 && day > 7
                    ? tw`text-gray-400`
                    : weekIndex === calendarDays.length - 1 && day < 7
                    ? tw`text-gray-400`
                    : tw`text-gray-800`
                }
              >
                {day}
              </Text>
            </View>
          ))}
        </View>
      ))}

      <View style={tw`h-px bg-gray-300 my-6`} />

      {/* Add Task Button */}
      <TouchableOpacity
        style={tw`bg-blue-500 p-4 rounded-lg items-center shadow`}
        onPress={() => setShowTaskPopup(true)}
      >
        <Text style={tw`text-white font-medium text-lg`}>+ Add Task</Text>
      </TouchableOpacity>

      {/* Tasks List */}
      {tasks.map((task) => (
        <View
          key={task.id}
          style={tw`flex-row justify-between py-4 px-4 bg-white rounded-lg shadow mb-4`}
        >
          <View style={tw`flex-1`}>
            <Text style={tw`font-medium text-gray-800`}>{task.name}</Text>
            <Text style={tw`text-sm text-gray-600`}>
              {task.duration} mins - {task.priority}
            </Text>
          </View>
          <TouchableOpacity
            style={tw`bg-red-500 p-2 rounded-lg`}
            onPress={() => handleDeleteTask(task.id)}
          >
            <Text style={tw`text-white text-sm font-bold`}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Submit Button */}
      <TouchableOpacity
        style={tw`bg-green-500 p-4 rounded-lg items-center shadow mt-4`}
        onPress={handleSubmit}
      >
        <Text style={tw`text-white font-bold text-lg`}>Submit</Text>
      </TouchableOpacity>

      {/* Add Task Popup */}
      <Modal visible={showTaskPopup} transparent animationType="slide">
        <View
          style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center`}
        >
          <View style={tw`w-11/12 bg-white rounded-lg p-6 shadow-lg`}>
            <Text
              style={tw`text-lg font-bold mb-6 text-center text-gray-800`}
            >
              Add New Task
            </Text>

            <TextInput
              placeholder="Task name"
              value={newTask.name}
              onChangeText={(text) => setNewTask({ ...newTask, name: text })}
              style={tw`border border-gray-300 rounded-lg p-3 mb-4 bg-gray-50`}
            />

            <TextInput
              placeholder="Duration (in minutes)"
              value={newTask.duration.toString()}
              onChangeText={(text) =>
                setNewTask({
                  ...newTask,
                  duration: parseInt(text) || 0,
                })
              }
              keyboardType="numeric"
              style={tw`border border-gray-300 rounded-lg p-3 mb-4 bg-gray-50`}
            />

            <View style={tw`flex-row justify-between`}>
              {(["Low", "Medium", "High"] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={tw`flex-1 p-3 border border-gray-300 rounded-lg mx-1 ${
                    newTask.priority === level
                      ? "border-blue-500 bg-blue-100"
                      : "bg-gray-50"
                  }`}
                  onPress={() => setNewTask({ ...newTask, priority: level })}
                >
                  <Text style={tw`text-center text-gray-800`}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={tw`flex-row justify-between mt-6`}>
              <TouchableOpacity
                style={tw`flex-1 p-3 rounded-lg bg-gray-100 mx-1 items-center`}
                onPress={() => setShowTaskPopup(false)}
              >
                <Text style={tw`text-gray-600`}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`flex-1 p-3 rounded-lg bg-blue-500 mx-1 items-center`}
                onPress={handleAddTask}
              >
                <Text style={tw`text-white font-bold`}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
