import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Image,
} from "react-native";

// Define badge types for type safety
interface RegularBadge {
  id: number;
  color: string;
  stars: number;
  special?: false;
}

interface SpecialBadge {
  id: number;
  color: string;
  special: true;
}

type Badge = RegularBadge | SpecialBadge;

export default function Profile() {
  // Badge data for the badges section
  const badges: Badge[] = [
    { id: 1, color: "red", stars: 3 },
    { id: 2, color: "purple", stars: 3 },
    { id: 3, color: "orange", stars: 3 },
    { id: 4, color: "blue", stars: 4 },
    { id: 5, color: "green", stars: 3 },
    { id: 6, color: "red", special: true },
  ];

  // Render a regular badge with stars
  const renderBadge = (color: string, stars: number) => {
    const colorMap: Record<string, string> = {
      red: "#ef4444",
      purple: "#a855f7",
      orange: "#f97316",
      blue: "#3b82f6",
      green: "#22c55e",
    };

    return (
      <View style={styles.badgeContainer}>
        <View style={styles.badgeBase}>
          {Array.from({ length: stars }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.star,
                {
                  top: 3 + i * 4,
                  left: i % 2 === 0 ? 3 : 7,
                },
              ]}
            />
          ))}
        </View>
        <View
          style={[
            styles.badgeBottom,
            { backgroundColor: colorMap[color] || color },
          ]}
        />
      </View>
    );
  };

  // Render the special star badge
  const renderSpecialBadge = () => (
    <View style={styles.badgeContainer}>
      <View style={styles.specialBadgeOuter}>
        <View style={styles.specialBadgeMiddle}>
          <Text style={styles.starText}>★</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Tools Title */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Methods</Text>

        {/* Profile Picture - Updated with Image */}
        <View style={styles.profilePictureContainer}>
          <Image
            source={require("../../assets/images/profile.png")} // Update this path
            style={styles.profileImage}
            resizeMode="cover"
          />
          {/* <View style={styles.profilePictureBottom} /> */}
        </View>
      </View>

      {/* Separator Line */}
      <View style={styles.separator} />

      {/* Profile Details */}
      <View style={styles.profileDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Full Name:</Text>
          <Text style={styles.detailValue}>Juan Dela Cruz</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={[styles.detailValue, { marginLeft: 40 }]}>
            Juan@Gmail.com
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* Separator Line */}
      <View style={styles.separator} />

      {/* Badges Section */}
      <View style={styles.badgesSection}>
        <Text style={styles.sectionTitle}>Badges</Text>

        <View style={styles.badgesGrid}>
          {badges.map((badge) => (
            <View key={badge.id} style={styles.badgeWrapper}>
              {badge.special
                ? renderSpecialBadge()
                : renderBadge(badge.color, "stars" in badge ? badge.stars : 3)}
            </View>
          ))}
        </View>
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
  profilePictureContainer: {
    marginTop: 8,
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 40, // Make it circular
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden", // Ensures the image stays within the circular bounds
  },
  profileImage: {
    width: 78, // Slightly smaller than container to account for border
    height: 78,
    borderRadius: 39, // Half of width/height to make it circular
  },
  profilePicture: {
    width: 48,
    height: 48,
    backgroundColor: "#60a5fa",
    borderRadius: 24,
  },
  // profilePictureBottom: {
  //   width: "100%",
  //   height: 32,
  //   backgroundColor: "#3b82f6",
  //   position: "absolute",
  //   bottom: 0,
  // },
  separator: {
    borderTopWidth: 1,
    borderColor: "#d1d5db",
    marginTop: 16,
    marginHorizontal: 24,
  },
  profileDetails: {
    marginHorizontal: 24,
    marginTop: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontWeight: "bold",
    fontSize: 16,
  },
  detailValue: {
    fontSize: 16,
    marginLeft: 8,
  },
  actionButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
  badgesSection: {
    marginHorizontal: 24,
    marginTop: 16,
  },
  sectionTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 16,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  badgeWrapper: {
    marginBottom: 16,
  },
  badgeContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    position: "relative",
  },
  badgeBase: {
    width: 40,
    height: 40,
    backgroundColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  star: {
    width: 6,
    height: 6,
    backgroundColor: "#fbbf24",
    borderRadius: 3,
    position: "absolute",
  },
  badgeBottom: {
    width: 16,
    height: 24,
    position: "absolute",
    bottom: -8,
  },
  specialBadgeOuter: {
    width: 40,
    height: 40,
    backgroundColor: "#ef4444",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  specialBadgeMiddle: {
    width: 32,
    height: 32,
    backgroundColor: "#fbbf24",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  starText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
