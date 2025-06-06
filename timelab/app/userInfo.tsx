"use client";

import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../FirebaseConfig";
import { Alert } from "react-native";
import { userService } from "../lib/userService";

const { width } = Dimensions.get("window");

type RootStackParamList = {
  welcomePage: undefined;
};

export default function AuthScreens() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState("signup");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  // Animation value for sliding between screens
  // Sign Up form states
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // Sign In form states
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  // Animation value for sliding between screens
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleTab = (tab: "signup" | "signin") => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      Animated.timing(slideAnim, {
        toValue: tab === "signup" ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  // Interpolate slide animation
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
  });

  // Sign Up function
  const handleSignUp = async () => {
    if (!signUpData.email || !signUpData.password || !signUpData.fullName) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (signUpData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signUpData.email,
        signUpData.password
      );

      // Store user profile in Firestore
      await userService.createUserProfile(
        userCredential.user.uid,
        signUpData.fullName,
        signUpData.email
      );

      console.log("User created successfully:", userCredential.user.uid);
      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("(tabs)", { screen: "index" }),
        },
      ]);
    } catch (error: any) {
      console.error("Sign up error:", error);
      Alert.alert("Sign Up Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Sign In function
  const handleSignIn = async () => {
    if (!signInData.email || !signInData.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        signInData.email,
        signInData.password
      );

      console.log("User signed in successfully:", userCredential.user.uid);
      Alert.alert("Success", "Signed in successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("(tabs)", { screen: "index" }),
        },
      ]);
    } catch (error: any) {
      console.error("Sign in error:", error);
      let errorMessage = "An error occurred during sign in";

      // Handle all possible Firebase auth error codes
      switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
        case "auth/invalid-email":
          errorMessage = "Incorrect email or password";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Too many failed login attempts. Please try again later";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection";
          break;
        default:
          errorMessage = "Sign in failed. Please try again";
      }

      Alert.alert("Sign In Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with tabs */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={() => toggleTab("signup")}
            style={styles.tab}
          >
            <Text style={styles.tabText}>Sign Up</Text>
            {activeTab === "signup" && (
              <View style={styles.activeTabIndicator} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleTab("signin")}
            style={styles.tab}
          >
            <Text style={styles.tabText}>Sign In</Text>
            {activeTab === "signin" && (
              <View style={styles.activeTabIndicator} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Sliding content container */}
      <Animated.View
        style={[styles.slidingContainer, { transform: [{ translateX }] }]}
      >
        {/* Sign Up Screen */}
        <View style={styles.screen}>
          <Text style={styles.title}>Create An Account</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#333"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#666"
              value={signUpData.fullName}
              onChangeText={(text) =>
                setSignUpData({ ...signUpData, fullName: text })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#333"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              value={signUpData.email}
              onChangeText={(text) =>
                setSignUpData({ ...signUpData, email: text })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#333"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry={!passwordVisible}
              value={signUpData.password}
              onChangeText={(text) =>
                setSignUpData({ ...signUpData, password: text })
              }
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#333"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.authButton, loading && styles.disabledButton]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.authButtonText}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or sign up with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.googleButton}>
              <Ionicons name="logo-google" size={20} color="#333" />
              <Text style={styles.googleButtonText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.facebookButton}>
              <Ionicons name="logo-facebook" size={20} color="white" />
              <Text style={styles.facebookButtonText}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign In Screen */}
        <View style={styles.screen}>
          <Text style={styles.title}>Welcome Back!</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#333"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              value={signInData.email}
              onChangeText={(text) =>
                setSignInData({ ...signInData, email: text })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#333"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry={!passwordVisible}
              value={signInData.password}
              onChangeText={(text) =>
                setSignInData({ ...signInData, password: text })
              }
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#333"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.rememberForgotContainer}>
            <TouchableOpacity
              style={styles.rememberContainer}
              onPress={() => setRememberPassword(!rememberPassword)}
            >
              <View style={styles.checkbox}>
                {rememberPassword && (
                  <Ionicons name="checkmark" size={16} color="#333" />
                )}
              </View>
              <Text style={styles.rememberText}>Remember Password</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.authButton, loading && styles.disabledButton]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.authButtonText}>
              {loading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or sign in with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.googleButton}>
              <Ionicons name="logo-google" size={20} color="#333" />
              <Text style={styles.googleButtonText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.facebookButton}>
              <Ionicons name="logo-facebook" size={20} color="white" />
              <Text style={styles.facebookButtonText}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Bottom curved shape */}
      <View style={styles.bottomCurve} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#2A2A5A",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
  },
  tab: {
    alignItems: "center",
    paddingVertical: 10,
  },
  tabText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 2,
    backgroundColor: "white",
  },
  slidingContainer: {
    flex: 1,
    flexDirection: "row",
    width: width * 2,
  },
  screen: {
    width,
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2A2A5A",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    padding: 5,
  },
  rememberForgotContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#2A2A5A",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rememberText: {
    color: "#2A2A5A",
    fontSize: 14,
  },
  forgotText: {
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "500",
  },
  authButton: {
    backgroundColor: "#2A2A5A",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 25,
  },
  authButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    paddingHorizontal: 10,
    color: "#666",
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flex: 0.48,
  },
  googleButtonText: {
    color: "#333",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  facebookButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2A2A5A",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 0.48,
  },
  facebookButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  bottomCurve: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#2A2A5A",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
