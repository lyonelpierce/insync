import React from "react";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "~/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "~/components/ui/button";

const _layout = () => {
  const router = useRouter();

  return (
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
          headerRight: () => (
            <Button
              className="bg-green-600 rounded-lg"
              onPress={() => router.back()}
            >
              <Text>Post</Text>
            </Button>
          ),
        }}
      />
    </Stack>
  );
};

export default _layout;
