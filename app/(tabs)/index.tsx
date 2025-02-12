// app/index.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome!</Text>

      <TouchableOpacity 
        onPress={() => router.push("./auth/LoginScreen")} 
        style={{ backgroundColor: "blue", padding: 15 }}>
        <Text style={{ color: "white" }}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}
