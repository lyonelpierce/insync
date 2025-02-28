import { View } from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Text } from "~/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Button } from "~/components/ui/button";
import { useUserProfile } from "~/hooks/useUserProfile";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { HeartPulseIcon, MessageCircleIcon } from "lucide-react-native";
import { type ParamListBase, useNavigation } from "@react-navigation/native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { AnimationContext } from "~/app/context/animation-context";

const CreateTabIcon = ({ color, size }: { color: string; size: number }) => (
  <View className="bg-gray-300/10 rounded-lg">
    <Ionicons name="add" size={size} color={color} />
  </View>
);

export default function Layout() {
  const router = useRouter();
  const { userProfile, isLoading } = useUserProfile();

  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const headerTranslateY = useSharedValue(0);

  if (isLoading || !userProfile) {
    return <Text>Loading...</Text>;
  }

  return (
    <AnimationContext.Provider value={{ headerTranslateY }}>
      <View className="flex-1 bg-transparent">
        <Tabs
          screenOptions={{
            // headerShown: false,
            // headerTitle: "InSync",
            // headerTitleStyle: {
            //   color: "white",
            // },
            // headerStyle: {
            //   backgroundColor: "transparent",
            // },
            header: () => (
              <Animated.View
                className="absolute top-0 left-0 right-0 z-10"
                style={[
                  {
                    transform: [{ translateY: headerTranslateY }],
                  },
                ]}
              >
                <View className="flex-row items-center justify-between pt-16 px-4 pb-2">
                  <BlurView
                    intensity={30}
                    tint="dark"
                    className="absolute inset-0"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onPress={() => navigation.openDrawer()}
                  >
                    <Avatar alt="User Avatar">
                      <AvatarImage
                        source={{ uri: userProfile?.imageUrl || undefined }}
                      />
                      <AvatarFallback>
                        <Text>
                          {userProfile?.first_name?.charAt(0)}
                          {userProfile?.last_name?.charAt(0)}
                        </Text>
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                  <Text className="text-xl font-semibold text-white">
                    InSync
                  </Text>
                  <Button size="icon" variant="ghost">
                    <Ionicons name="search-outline" size={24} color="white" />
                  </Button>
                </View>
              </Animated.View>
            ),
            tabBarBackground: () => (
              <BlurView intensity={30} tint="dark" style={{ flex: 1 }} />
            ),
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: "rgba(0,0,0,0.3)",
              paddingTop: 10,
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
          <Tabs.Screen
            name="messages"
            options={{
              tabBarIcon: ({ color, size }) => (
                <MessageCircleIcon size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{ href: null, headerShown: false }}
          />
        </Tabs>
      </View>
    </AnimationContext.Provider>
  );
}
