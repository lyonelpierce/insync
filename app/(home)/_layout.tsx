import { View } from "react-native";
import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <View className="flex-1 relative">
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "transparent" },
          headerShown: false,
        }}
      />
    </View>
  );
}
