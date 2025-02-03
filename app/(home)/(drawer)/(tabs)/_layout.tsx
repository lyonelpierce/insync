import { View } from "react-native";
import * as Haptics from "expo-haptics";
import BallBg from "~/components/BallBg";
import { useUser } from "@clerk/clerk-expo";
import { Text } from "~/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Button } from "~/components/ui/button";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { HeartPulseIcon, MessageCircleIcon } from "lucide-react-native";
import { type ParamListBase, useNavigation } from "@react-navigation/native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

const CreateTabIcon = ({ color, size }: { color: string; size: number }) => (
  <View className="bg-gray-300/10 rounded-lg">
    <Ionicons name="add" size={size} color={color} />
  </View>
);

export default function Layout() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className="flex-1">
      <BallBg />
      <Tabs
        screenOptions={{
          headerShown: true,
          headerTitle: "InSync",
          headerTitleStyle: {
            color: "white",
          },
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerLeft: () => (
            <Button
              size="icon"
              style={{ paddingLeft: 24 }}
              onPress={() => navigation.openDrawer()}
            >
              <Avatar alt="User Avatar">
                <AvatarImage source={{ uri: user?.imageUrl }} />
                <AvatarFallback>
                  <Text>{user?.firstName?.charAt(0)}</Text>
                </AvatarFallback>
              </Avatar>
            </Button>
          ),
          headerRight: () => (
            <View style={{ paddingRight: 12 }}>
              <Button size="icon" variant="ghost">
                <Ionicons name="search-outline" size={24} color="white" />
              </Button>
            </View>
          ),
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
          name="create"
          options={{
            tabBarIcon: ({ color, size }) => (
              <CreateTabIcon color={color} size={size} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              Haptics.selectionAsync();
              router.push("/(home)/(modal)/create");
            },
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
