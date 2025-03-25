import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Image,
  ImageSourcePropType,
} from "react-native";

interface Tool {
  id: number;
  title: string;
  icon: ImageSourcePropType; // Update type to ImageSourcePropType
  colors: string[];
}

export default function Tools() {
  const tools: Tool[] = [
    {
      id: 1,
      title: "80/20 Rule",
      icon: require("../../assets/images/8020_rule.png"),
      colors: ["#e0e8ff", "#d0d8ff"],
    },
    {
      id: 2,
      title: "Pomodoro",
      icon: require("../../assets/images/pomodoro.png"),
      colors: ["#e0f0ff", "#d0e8ff"],
    },
    {
      id: 3,
      title: "Custom",
      icon: require("../../assets/images/custom.png"),
      colors: ["#e0f0ff", "#d0e8ff"],
    },
  ];

  const renderIcon = (tool: Tool) => {
    return (
      <View style={styles.iconContainer}>
        <Image
          source={tool.icon}
          style={styles.toolIcon}
          resizeMode="contain"
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Methods</Text>
      </View>

      <View style={styles.gridContainer}>
        {tools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={[styles.toolCard, { backgroundColor: tool.colors[0] }]}
            activeOpacity={0.7}
          >
            {renderIcon(tool)}
            <Text style={styles.toolTitle}>{tool.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  toolCard: {
    width: Dimensions.get("window").width * 0.45 - 20,
    borderRadius: 12,
    marginBottom: 24,
    padding: 16,
    alignItems: "center",
  },
  toolTitle: {
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500",
    fontSize: 18,
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  toolIcon: {
    width: 40,
    height: 40,
  },
});
