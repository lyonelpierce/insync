import { BlurView } from "expo-blur";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useUserProfile } from "~/hooks/useUserProfile";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeftIcon,
  EllipsisVerticalIcon,
  MessageCircleIcon,
} from "lucide-react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { PostCard } from "~/components/posts/postCards";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { api } from "~/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useIsFocused } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import { useCallback, useState } from "react";

const profile = () => {
  const router = useRouter();
  const { userProfile } = useUserProfile();
  const navigation = useNavigation();
  const scrollOffset = useSharedValue(0);
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();

  const { user } = useUser();

  const isOwner = userProfile?.clerkId === user?.id;

  const { results, loadMore } = usePaginatedQuery(
    api.posts.getPosts,
    { userId: userProfile?._id },
    {
      initialNumItems: 10,
    }
  );

  const updateTabbar = () => {
    let newMarginBottom = 0;
    if (scrollOffset.value >= 0 && scrollOffset.value <= tabBarHeight) {
      newMarginBottom = -scrollOffset.value;
    } else if (scrollOffset.value > tabBarHeight) {
      newMarginBottom = -tabBarHeight;
    }

    navigation?.setOptions({
      tabBarStyle: { marginBottom: newMarginBottom },
    });
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (isFocused) {
        scrollOffset.value = event.contentOffset.y;
        runOnJS(updateTabbar)();
      }
    },
  });

  const onLoadmore = () => {
    loadMore(5);
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused

      return () => {
        navigation
          .getParent()
          ?.setOptions({ tabBarStyle: { marginBottom: 0 } });
      };
    }, [])
  );

  return (
    <View className="flex-1">
      <View className="h-1/2 w-full rounded-b-3xl overflow-hidden">
        <BlurView intensity={20} tint="light" className="h-full w-full flex">
          <SafeAreaView className="flex-row justify-between items-center px-4">
            <Button
              className="rounded-full aspect-square items-center justify-center"
              onPress={() => router.back()}
              variant="ghost"
            >
              <ChevronLeftIcon size={24} color="white" />
            </Button>
            <Text className="text-white text-2xl">
              {userProfile?.first_name} {userProfile?.last_name}
            </Text>
            <EllipsisVerticalIcon size={24} color="white" />
          </SafeAreaView>
          <View className="items-center flex h-full gap-8">
            <Avatar
              alt="User Avatar"
              className="w-32 h-32 border border-[#474747] p-2"
            >
              <AvatarImage
                source={{
                  uri: userProfile?.imageUrl || "fallback-uri-here",
                }}
                className="rounded-full"
              />
              <AvatarFallback>
                <Text>
                  {userProfile?.first_name?.charAt(0)}
                  {userProfile?.last_name?.charAt(0)}
                </Text>
              </AvatarFallback>
            </Avatar>
            <Text className="text-[#FCFCFB] text-2xl font-medium">
              @{userProfile?.username}
            </Text>
            {!isOwner ? (
              <View className="flex-row gap-4">
                <Button className="bg-green-600 w-36 rounded-xl min-h-14">
                  <Text className="text-white font-semibold">Sync</Text>
                </Button>
                <Button className="rounded-full aspect-square items-center justify-center w-12 bg-gray-600">
                  <MessageCircleIcon size={20} color="white" />
                </Button>
              </View>
            ) : (
              <View className="flex-row gap-4">
                <Button
                  className="bg-green-600 w-36 rounded-xl min-h-14"
                  onPress={() => router.push("/(home)/(modal)/editprofile")}
                >
                  <Text className="text-white font-semibold">Edit Profile</Text>
                </Button>
              </View>
            )}
          </View>
        </BlurView>
      </View>
      <Animated.FlatList
        data={results}
        className="p-4"
        onScroll={scrollHandler}
        scrollEventThrottle={10}
        onEndReached={onLoadmore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => <PostCard post={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={"white"}
          />
        }
      />
    </View>
  );
};

export default profile;
