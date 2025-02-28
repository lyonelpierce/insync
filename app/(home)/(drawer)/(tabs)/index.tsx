import {
  useIsFocused,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { api } from "~/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { View, RefreshControl } from "react-native";
import React, { useCallback, useState } from "react";
import { PostCard } from "~/components/posts/postCards";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Animated, {
  useAnimatedScrollHandler,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useAnimationContext } from "~/app/context/animation-context";

export default function Page() {
  const [refreshing, setRefreshing] = useState(false);
  const { top } = useSafeAreaInsets();

  const navigation = useNavigation();
  const scrollOffset = useSharedValue(0);
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();

  const { headerTranslateY } = useAnimationContext();
  const lastScrollY = useSharedValue(0);

  const { results, loadMore } = usePaginatedQuery(
    api.posts.getPosts,
    {},
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
      const currentScrollY = event.contentOffset.y;
      const scrollDiff = currentScrollY - lastScrollY.value;

      if (scrollDiff > 0 && currentScrollY > 50) {
        // Scrolling down - hide header
        headerTranslateY.value = withTiming(-100, { duration: 250 });
      } else if (scrollDiff < 0) {
        // Only show header when explicitly scrolling up
        headerTranslateY.value = withTiming(0, { duration: 250 });
      }

      lastScrollY.value = currentScrollY;

      if (isFocused) {
        scrollOffset.value = event.contentOffset.y;
        runOnJS(updateTabbar)();
      }
    },
  });

  const onLoadmore = () => {
    loadMore(5);
  };

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
      <Animated.FlatList
        data={results}
        className="p-4"
        onScroll={scrollHandler}
        scrollEventThrottle={10}
        onEndReached={onLoadmore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={{ paddingVertical: top + 24 }}
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
}
