import React from "react";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useRouter } from "expo-router";
import BallBg from "~/components/BallBg";
import { Text } from "~/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "~/components/ui/button";
import { SaveIcon, SquarePen } from "lucide-react-native";

const _layout = () => {
  const router = useRouter();

  return (
    <View className="flex-1">
      <BallBg />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "white" },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modal)/create"
          options={{
            presentation: "modal",
            title: "New Post",
            headerTitleStyle: {
              color: "white",
            },
            headerLeft: () => (
              <Ionicons
                name="close"
                size={24}
                color="white"
                onPress={() => router.back()}
              />
            ),
            headerBackground: () => <View className="flex-1 bg-[#393D42]" />,
            headerRight: () => <SquarePen size={24} color="white" />,
          }}
        />
        <Stack.Screen
          name="(modal)/editprofile"
          options={{
            presentation: "modal",
            title: "Edit Profile",
            headerTitleStyle: {
              color: "white",
            },
            headerLeft: () => (
              <Ionicons
                name="close"
                size={24}
                color="white"
                onPress={() => router.back()}
              />
            ),
            headerBackground: () => <View className="flex-1 bg-[#353D48]" />,
          }}
        />
      </Stack>
    </View>
  );
};

export default _layout;
