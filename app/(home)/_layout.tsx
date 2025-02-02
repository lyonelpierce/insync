import { View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { HeartPulseIcon, MessageCircleIcon } from "lucide-react-native";
import BallBg from "~/components/BallBg";

export default function Layout() {
  return (
    <View className="flex-1">
      <BallBg />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "transparent",
            position: "absolute",
            elevation: 0,
            borderTopWidth: 0,
            bottom: 0,
          },
          sceneStyle: {
            backgroundColor: "transparent",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="health"
          options={{
            tabBarIcon: ({ color, size }) => (
              <HeartPulseIcon size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MessageCircleIcon size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="notifications-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
