import React from "react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Text, View, FlatList } from "react-native";
import { PostCard } from "~/components/posts/postCards";

export default function Page() {
  const posts = useQuery(api.posts.list);

  return (
    <View className="flex-1 p-4">
      <FlatList
        data={posts}
        className="flex-1 pb-24"
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item._id.toString()}
        ListEmptyComponent={() => (
          <Text className="text-white text-center p-4">No posts yet</Text>
        )}
      />
    </View>
  );
}
