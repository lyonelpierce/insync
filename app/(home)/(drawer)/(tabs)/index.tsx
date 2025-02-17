import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Text, View, FlatList, Image } from "react-native";
import React from "react";
import { AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Avatar } from "~/components/ui/avatar";
import { EllipsisVerticalIcon } from "lucide-react-native";

export default function Page() {
  const posts = useQuery(api.posts.list);

  return (
    <View className="flex-1 p-6">
      <FlatList
        data={posts}
        className="flex-1"
        renderItem={({ item }) => (
          <View className="p-6 bg-[#353D48]/25 rounded-3xl mb-6">
            <View className="flex flex-row items-center justify-between gap-2 mb-4">
              <View className="flex flex-row items-center gap-2">
                <Avatar alt={item.user.username} className="w-12 h-12">
                  <AvatarImage
                    source={{ uri: item.user.imageUrl }}
                    className="rounded-full"
                  />
                  <AvatarFallback>
                    <Text>{item.user.username}</Text>
                  </AvatarFallback>
                </Avatar>
                <View className="-mt-2">
                  <Text className="text-[#FCFCFB] text-lg font-medium mt-2">
                    {item.user.username}
                  </Text>
                  <Text className="text-[#D9D9D9] text-sm">
                    {(() => {
                      const created = new Date(item.created_at);
                      const now = new Date();
                      const diff = now.getTime() - created.getTime();
                      const minutes = Math.floor(diff / 60000);
                      const hours = Math.floor(minutes / 60);
                      const days = Math.floor(hours / 24);

                      if (minutes < 60) return `${minutes}m`;
                      if (hours < 24) return `${hours}h`;
                      return `${days}d`;
                    })()}{" "}
                    ago
                  </Text>
                </View>
              </View>

              <EllipsisVerticalIcon size={24} color="white" />
            </View>
            {item.mediaFiles && item.mediaFiles.length > 0 && (
              <View className="flex flex-row flex-wrap">
                {item.mediaFiles.map((mediaId: string, index: number) => {
                  return (
                    <View key={mediaId} className="w-1/2 p-1">
                      <Image
                        source={{ uri: mediaId }}
                        className="w-full h-48 rounded-lg"
                        resizeMode="cover"
                        onError={(error) =>
                          console.error(
                            "Image loading error:",
                            error.nativeEvent.error
                          )
                        }
                      />
                    </View>
                  );
                })}
              </View>
            )}
            <Text className="text-[#D9D9D9] text-lg">{item.content}</Text>
          </View>
        )}
        keyExtractor={(item) => item._id.toString()}
        ListEmptyComponent={() => (
          <Text className="text-white text-center p-4">No posts yet</Text>
        )}
      />
    </View>
  );
}
