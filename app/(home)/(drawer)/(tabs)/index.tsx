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
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";

export default function Page() {
  const [refreshing, setRefreshing] = useState(false);
  const { top } = useSafeAreaInsets();

  const navigation = useNavigation();
  const scrollOffset = useSharedValue(0);
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();

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
