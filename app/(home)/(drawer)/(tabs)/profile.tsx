import { BlurView } from "expo-blur";
import { View, Text } from "react-native";
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
import { useRouter } from "expo-router";

const profile = () => {
  const router = useRouter();
  const { userProfile } = useUserProfile();

  const { user } = useUser();

  const isOwner = userProfile?.clerkId === user?.id;

  return (
    <View className="flex-1">
      <View className="h-1/2 w-full rounded-b-3xl overflow-hidden">
        <BlurView intensity={20} tint="light" className="h-full w-full flex">
          <SafeAreaView className="flex-row justify-between items-center px-4">
            <ChevronLeftIcon size={24} color="white" />
            <Text className="text-white text-2xl">
              {userProfile?.first_name} {userProfile?.last_name}
            </Text>
            <EllipsisVerticalIcon size={24} color="white" />
          </SafeAreaView>
          <View className="items-center flex h-full gap-8">
            <Avatar
              alt="User Avatar"
              className="w-32 h-32 border border-[#FCFCFB] p-4"
            >
              <AvatarImage
                source={{
                  uri: userProfile?.imageUrl || "fallback-uri-here",
                }}
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
      <Text className="text-white">profile</Text>
    </View>
  );
};

export default profile;
