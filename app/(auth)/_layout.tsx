import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { View } from "react-native";
import { BlurView } from "expo-blur";
import BallBg from "~/components/BallBg";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return (
    <View className="flex-1 relative">
      <BallBg />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="landing" />
      </Stack>
    </View>
  );
}
