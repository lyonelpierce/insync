import React, { useCallback, useState } from "react";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Text, View, FlatList, RefreshControl } from "react-native";
import { PostCard } from "~/components/posts/postCards";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Page() {
  const [refreshing, setRefreshing] = useState(false);
  const { top } = useSafeAreaInsets();

  const navigation = useNavigation();
  const scrollOffset = useSharedValue(0);
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();

  const { results, status, loadMore } = usePaginatedQuery(
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

    navigation
      .getParent()
      ?.setOptions({ tabBarStyle: { marginBottom: newMarginBottom } });
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
    <View className="flex-1 p-4">
      <Animated.FlatList
        onScroll={scrollHandler}
        scrollEventThrottle={10}
        data={results}
        renderItem={({ item }) => <PostCard post={item} />}
        onEndReached={onLoadmore}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View className="my-1" />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
