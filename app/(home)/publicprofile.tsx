import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Redirect, useLocalSearchParams } from "expo-router";
import { api } from "~/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Id } from "~/convex/_generated/dataModel";

const PublicProfile = () => {
  const { userId } = useLocalSearchParams();
  const currentUser = useQuery(api.users.current);

  if (!userId) {
    return <Redirect href="/" />;
  }

  const userProfile = useQuery(api.users.getUserById, {
    userId: userId as Id<"users">,
  });

  const friendshipStatus = useQuery(api.users.checkFriendshipStatus, {
    userId1: currentUser?._id as Id<"users">,
    userId2: userId as Id<"users">,
  });

  const sendRequest = useMutation(api.users.sendFriendRequest);
  const respondToRequest = useMutation(api.users.respondToFriendRequest);
  const cancelRequest = useMutation(api.users.cancelFriendRequest);

  if (!userProfile || !currentUser || !friendshipStatus) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  const handleFriendAction = async () => {
    if (friendshipStatus.status === "none") {
      await sendRequest({ receiverId: userId as Id<"users"> });
    } else if (
      friendshipStatus.status === "pending" &&
      friendshipStatus.request?.receiver_id === currentUser._id
    ) {
      await respondToRequest({
        requestId: friendshipStatus.request._id,
        accept: true,
      });
    } else if (
      friendshipStatus.status === "pending" &&
      friendshipStatus.request?.sender_id === currentUser._id
    ) {
      await cancelRequest({
        requestId: friendshipStatus.request._id,
      });
    }
  };

  const getFriendButtonText = () => {
    if (friendshipStatus.status === "friends") return "Friends";
    if (friendshipStatus.status === "pending") {
      if (friendshipStatus.request?.sender_id === currentUser._id) {
        return "Cancel Request";
      }
      return "Accept Request";
    }
    return "Add Friend";
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-white text-2xl font-bold mb-4">
        {userProfile.username}
      </Text>

      {currentUser._id !== userId && (
        <TouchableOpacity
          className={`px-4 py-2 rounded-full ${
            friendshipStatus.status === "friends"
              ? "bg-gray-600"
              : friendshipStatus.status === "pending"
                ? "bg-yellow-600"
                : "bg-blue-600"
          }`}
          onPress={handleFriendAction}
          disabled={friendshipStatus.status === "friends"}
        >
          <Text className="text-white font-semibold">
            {getFriendButtonText()}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PublicProfile;
