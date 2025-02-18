import React from "react";
import { Text, View, Image } from "react-native";
import { Button } from "~/components/ui/button";
import {
  BookmarkIcon,
  EllipsisVerticalIcon,
  HeartIcon,
  MessageCircleIcon,
  Repeat2Icon,
} from "lucide-react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { PostCardProps } from "~/types/Posts";

export function PostCard({ post }: PostCardProps) {
  return (
    <View className="p-6 bg-[#353D48]/25 rounded-3xl mb-6">
      <View className="flex flex-row items-center justify-between gap-2 mb-4">
        <View className="flex flex-row items-center gap-2">
          <Avatar alt={post.user.username!} className="w-12 h-12">
            <AvatarImage
              source={{ uri: post.user.imageUrl ?? undefined }}
              className="rounded-full object-cover"
            />
            <AvatarFallback>
              <Text>{post.user.username}</Text>
            </AvatarFallback>
          </Avatar>
          <View className="-mt-2">
            <Text className="text-[#FCFCFB] text-lg font-medium mt-2">
              {post.user.username}
            </Text>
            <Text className="text-[#D9D9D9] text-sm">
              {(() => {
                const created = new Date(post.created_at);
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
      <Text className="text-[#D9D9D9] text-lg">{post.content}</Text>
      {post.mediaFiles && post.mediaFiles.length > 0 && (
        <View className="flex flex-row flex-wrap">
          {post.mediaFiles.map((mediaId: string | null) => {
            if (!mediaId) return null;
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
      <View className="flex flex-row items-center justify-between mt-2">
        <View>
          <Button
            className="flex flex-row items-center gap-2 native:px-0"
            variant="ghost"
          >
            <View className=" h-10 w-10 flex items-center justify-center rounded-full bg-[#353D48]/40">
              <Repeat2Icon size={18} color="white" />
            </View>
            <Text className="text-white text-xl font-medium">
              {post.likeCount}
            </Text>
          </Button>
        </View>
        <View className="flex flex-row gap-4 items-center">
          <Button
            className="flex flex-row items-center gap-2 native:px-0"
            variant="ghost"
          >
            <View className=" h-10 w-10 flex items-center justify-center rounded-full bg-[#353D48]/40">
              <HeartIcon size={18} color="white" />
            </View>
            <Text className="text-white text-xl font-medium">
              {post.likeCount}
            </Text>
          </Button>
          <Button
            className="flex flex-row items-center gap-2 native:px-0"
            variant="ghost"
          >
            <View className=" h-10 w-10 flex items-center justify-center rounded-full bg-[#353D48]/40">
              <MessageCircleIcon size={18} color="white" />
            </View>
            <Text className="text-white text-xl font-medium">
              {post.commentCount}
            </Text>
          </Button>
          <Button
            className="flex flex-row items-center gap-2 native:px-0"
            variant="ghost"
          >
            <View className=" h-10 w-10 flex items-center justify-center rounded-full bg-[#353D48]/40">
              <BookmarkIcon size={18} color="white" />
            </View>
            <Text className="text-white text-xl font-medium">
              {post.commentCount}
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
