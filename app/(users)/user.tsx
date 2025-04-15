import { View, Text } from "react-native";
import { useRouter } from "expo-router";

export default function UserHome() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome, User!</Text>
    </View>
  );
}
