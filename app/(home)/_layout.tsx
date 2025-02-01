import { View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { HeartPulseIcon, MessageCircleIcon } from "lucide-react-native";

export default function Layout() {
  return (
    <View className="flex-1 relative bg-transparent">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "transparent",
            position: "absolute",
            elevation: 0, // for Android
            borderTopWidth: 0, // removes the top border
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
          name="(health)/index"
          options={{
            tabBarIcon: ({ color, size }) => (
              <HeartPulseIcon size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(search)/index"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(messages)/index"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MessageCircleIcon size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(notifications)/index"
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
        <Tabs.Screen
          name="(profile)/index"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
