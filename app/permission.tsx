import React from "react";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Button } from "~/components/ui/button";
import { HeartIcon } from "lucide-react-native";
import { useSahha } from "~/providers/SahhaProvider";
import { SafeAreaView } from "react-native-safe-area-context";

const permission = () => {
  const router = useRouter();
  const { user } = useUser();
  const { authenticate, enableSensors, isAuthenticated, sensorStatus } =
    useSahha();

  const authenticateAndGetPermissions = async () => {
    const userId = user?.id;
    if (userId) {
      authenticate(userId);

      if (isAuthenticated) {
        enableSensors();
        if (isAuthenticated && sensorStatus === 3) {
          router.replace("/");
        }
      }
    }
  };

  return (
    <SafeAreaView className="bg-green-500 flex items-center justify-around flex-1 p-8">
      <View className="flex justify-center items-center gap-4">
        <HeartIcon size={200} color="white" strokeWidth={2} />
        <Text className="text-white text-2xl font-bold">
          Allow Health Data Permissions
        </Text>
        <Text className="text-white text-lg text-center">
          InSync needs access to your health data to provide you with the best
          possible experience.
        </Text>
      </View>
      <View className="flex flex-col gap-4 w-full">
        <Button
          className="bg-white rounded-full w-full min-h-14"
          onPress={authenticateAndGetPermissions}
        >
          <Text className="font-medium">Grant Permissions</Text>
        </Button>
        <Button
          variant="link"
          className="w-full p-0"
          onPress={() => router.replace("/")}
        >
          <Text className="text-white font-medium">Skip for now</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default permission;
