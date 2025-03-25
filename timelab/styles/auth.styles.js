import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff", // Added background color for consistency
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ff0000", // Use hex color for better compatibility
    marginBottom: 20, // Add spacing between title and image
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain", // Ensure the image fits properly without distortion
  },
});
