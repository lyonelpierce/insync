import React from "react";
import { useState } from "react";
import { Text, View, Image, Modal, Pressable, Dimensions } from "react-native";
import { Button } from "~/components/ui/button";
import {
  HeartIcon,
  Repeat2Icon,
  BookmarkIcon,
  MessageCircleIcon,
  EllipsisVerticalIcon,
} from "lucide-react-native";
import { PostCardProps } from "~/types/Posts";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export function PostCard({ post }: PostCardProps) {
  const toggleLike = useMutation(api.posts.toggleLike);
  const toggleBookmark = useMutation(api.posts.toggleBookmark);

  const [localLikeCount, setLocalLikeCount] = useState(post.likeCount);
  const [localBookmarkCount, setLocalBookmarkCount] = useState(
    post.bookmarkCount
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const isLiked = useQuery(api.posts.checkLikeStatus, { postId: post._id });
  const isBookmarked = useQuery(api.posts.checkBookmarkStatus, {
    postId: post._id,
  });

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
                <Pressable onPress={() => setSelectedImage(mediaId)}>
                  <Image
                    source={{ uri: mediaId }}
                    className="w-full h-48 rounded-lg object-cover"
                    resizeMode="cover"
                    onError={(error) =>
                      console.error(
                        "Image loading error:",
                        error.nativeEvent.error
                      )
                    }
                  />
                </Pressable>
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
              {post.repostCount}
            </Text>
          </Button>
        </View>
        <View className="flex flex-row gap-4 items-center">
          <Button
            className="flex flex-row items-center gap-2 native:px-0"
            variant="ghost"
            onPress={async () => {
              const isLiked = await toggleLike({ postId: post._id });
              setLocalLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
            }}
          >
            <View className="h-10 w-10 flex items-center justify-center rounded-full bg-[#353D48]/40">
              <HeartIcon
                size={18}
                color={isLiked ? "#FF3B30" : "white"}
                fill={isLiked ? "#FF3B30" : "transparent"}
              />
            </View>
            <Text className="text-white text-xl font-medium">
              {localLikeCount}
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
            onPress={async () => {
              const isBookmarked = await toggleBookmark({ postId: post._id });
              setLocalBookmarkCount((prev) =>
                isBookmarked ? prev + 1 : prev - 1
              );
            }}
          >
            <View className="h-10 w-10 flex items-center justify-center rounded-full bg-[#353D48]/40">
              <BookmarkIcon
                size={18}
                color={isBookmarked ? "#FFD700" : "white"}
                fill={isBookmarked ? "#FFD700" : "transparent"}
              />
            </View>
            <Text className="text-white text-xl font-medium">
              {localBookmarkCount}
            </Text>
          </Button>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={!!selectedImage}
        onRequestClose={() => setSelectedImage(null)}
      >
        <Pressable
          className="flex-1 bg-black/90 items-center justify-center"
          onPress={() => setSelectedImage(null)}
        >
          <Image
            source={{ uri: selectedImage ?? undefined }}
            style={{ width: screenWidth, height: screenHeight * 0.8 }}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>
    </View>
  );
}
