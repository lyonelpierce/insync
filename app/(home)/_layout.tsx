import React from "react";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useRouter } from "expo-router";
import BallBg from "~/components/BallBg";
import { Text } from "~/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "~/components/ui/button";
import { ChevronLeftIcon, SaveIcon, SquarePen } from "lucide-react-native";

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
            headerBackground: () => <View className="flex-1 bg-[#353D48]" />,
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
        <Stack.Screen
          name="(modal)/image/[url]"
          options={{
            presentation: "fullScreenModal",
            title: "",
            headerStyle: {
              backgroundColor: "black",
            },
            headerLeft: () => (
              <Button variant="ghost" size="icon">
                <Ionicons
                  name="close"
                  size={24}
                  color="white"
                  onPress={() => router.back()}
                />
              </Button>
            ),
            headerRight: () => (
              <Button variant="ghost" size="icon">
                <Ionicons name="ellipsis-horizontal" size={24} color="white" />
              </Button>
            ),
          }}
        />
        <Stack.Screen
          name="publicprofile"
          options={{
            headerTransparent: true,
            contentStyle: { backgroundColor: "transparent" },
            title: "",
            headerLeft: () => (
              <Button variant="ghost" size="icon">
                <ChevronLeftIcon
                  size={24}
                  color="white"
                  onPress={() => router.back()}
                />
              </Button>
            ),
          }}
        />
      </Stack>
    </View>
  );
};

export default _layout;
