import * as React from "react";
import { View, KeyboardAvoidingView, Platform, Image } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { useUserProfile } from "~/hooks/useUserProfile";

const Create = () => {
  const { userProfile, isLoading } = useUserProfile();

  if (isLoading || !userProfile) {
    return <Text>Loading...</Text>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-[#393D42]">
        <View className="border-b border-[#535F70]">
          <View className="px-4 py-2 flex-row items-start justify-start gap-2">
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
            <Textarea
              placeholder="What's on your heart?"
              className="bg-transparent border-0 text-white"
              multiline
              autoFocus={true}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Create;
