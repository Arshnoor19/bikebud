import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Switch,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../config/firebaseConfig"; // Make sure db is exported from firebaseConfig
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";

const SignUpScreen = () => {
  // State management for form fields and loading state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMechanic, setIsMechanic] = useState(false); // Toggle between user/mechanic
  const router = useRouter();

  /**
   * Handles the sign-up process with validation
   * 1. Validates all fields are filled
   * 2. Checks password match
   * 3. Enforces password length
   * 4. Creates user in Firebase Auth
   * 5. Stores additional user data in Firestore
   */
  const handleSignUp = async () => {
    // Field validation
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Store additional user data in Firestore
      const userRef = doc(
        db,
        isMechanic ? "mechanics" : "users",
        userCredential.user.uid
      );
      await setDoc(userRef, {
        email: email,
        userType: isMechanic ? "mechanic" : "user",
        createdAt: new Date(),
      });

      // Clear form and navigate
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Navigate based on user type
      if (isMechanic) {
        router.replace("/(mechanic)/dashboard"); // Mechanic dashboard
      } else {
        router.replace("/(users)/user"); // Updated to match your user.tsx file
      }
    } catch (error: any) {
      // Error handling with specific messages
      let errorMessage = "Sign-up failed. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      }

      Alert.alert("Sign-Up Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {/* User/Mechanic Toggle */}
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>User</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isMechanic ? "#007bff" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setIsMechanic(!isMechanic)}
          value={isMechanic}
          disabled={isLoading}
        />
        <Text style={styles.toggleText}>Mechanic</Text>
      </View>

      {/* Email Input */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isLoading}
      />

      {/* Password Input */}
      <TextInput
        placeholder="Password (min 6 characters)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        editable={!isLoading}
      />

      {/* Confirm Password Input */}
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        editable={!isLoading}
      />

      {/* Sign Up Button */}
      <TouchableOpacity
        onPress={handleSignUp}
        style={[styles.button, isLoading && styles.buttonDisabled]}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Sign Up as {isMechanic ? "Mechanic" : "User"}
          </Text>
        )}
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity
        onPress={() => router.push("/auth/LoginScreen")}
        style={styles.linkContainer}
        disabled={isLoading}
      >
        <Text style={[styles.linkText, isLoading && styles.linkDisabled]}>
          Already have an account? Log in
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Stylesheet for consistent styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  toggleText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 20,
  },
  linkText: {
    color: "#007bff",
    textAlign: "center",
    fontSize: 16,
  },
  linkDisabled: {
    color: "#cccccc",
  },
});

export default SignUpScreen;
