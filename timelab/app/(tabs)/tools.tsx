import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";

interface Tool {
  id: number;
  title: string;
  icon: string;
  iconType: string;
  colors: string[];
}

export default function Tools() {
  const tools: Tool[] = [
    {
      id: 1,
      title: "Methods",
      icon: "methods", // Updated to reference local image
      iconType: "image",
      colors: ["#e0e8ff", "#d0d8ff"],
    },
    {
      id: 2,
      title: "Sleep Timer",
      icon: "moon",
      iconType: "FontAwesome5",
      colors: ["#e0f0ff", "#d0e8ff"],
    },
    {
      id: 3,
      title: "Sounds",
      icon: "wave-square",
      iconType: "FontAwesome5",
      colors: ["#e0f0ff", "#d0e8ff"],
    },
  ];

  const renderIcon = (tool: Tool) => {
    if (tool.id === 1) {
      // Render methods.png image for Methods tool
      return (
        <View style={styles.iconContainer}>
          <Image
            source={require("../../assets/images/methods.png")} // Update path as needed
            style={styles.methodsIcon}
            resizeMode="contain"
          />
        </View>
      );
    } else if (tool.id === 2) {
      return (
        <View style={styles.iconContainer}>
          <View style={styles.moonIcon} />
          <View style={styles.zContainer}>
            <Text style={styles.zText}>z</Text>
            <Text style={[styles.zText, styles.zTextLarge]}>z</Text>
            <Text style={styles.zText}>z</Text>
          </View>
        </View>
      );
    } else if (tool.id === 3) {
      return (
        <View style={[styles.iconContainer, styles.soundContainer]}>
          <View
            style={[
              styles.soundBar,
              { height: 24, backgroundColor: "#f472b6" },
            ]}
          />
          <View
            style={[
              styles.soundBar,
              { height: 32, backgroundColor: "#ec4899" },
            ]}
          />
          <View
            style={[
              styles.soundBar,
              { height: 16, backgroundColor: "#a78bfa" },
            ]}
          />
          <View
            style={[
              styles.soundBar,
              { height: 28, backgroundColor: "#8b5cf6" },
            ]}
          />
          <View
            style={[
              styles.soundBar,
              { height: 20, backgroundColor: "#f472b6" },
            ]}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Tools</Text>
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
  methodsIcon: {
    width: 40, // Adjust size as needed
    height: 40,
  },
  // Keep all other existing styles
  moonIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#fbbf24",
    borderRadius: 16,
  },
  zContainer: {
    position: "absolute",
    right: 4,
    top: 4,
  },
  zText: {
    color: "#60a5fa",
    fontSize: 14,
    fontWeight: "bold",
  },
  zTextLarge: {
    fontSize: 18,
    marginLeft: 8,
  },
  soundContainer: {
    flexDirection: "row",
  },
  soundBar: {
    width: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
});
