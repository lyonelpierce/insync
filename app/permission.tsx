import React from "react";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import { Button } from "~/components/ui/button";
import { HeartIcon } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const permission = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-green-500 flex items-center justify-between flex-1 p-8">
      <Text className="text-white text-2xl font-bold">
        Allow Health Data Permissions
      </Text>
      <HeartIcon size={200} />
      <Text className="text-white text-lg text-center">
        InSync needs access to your health data to provide you with the best
        possible experience.
      </Text>
      <View className="flex flex-col gap-4 w-full">
        <Button className="bg-white rounded-full w-full">
          <Text>Grant Permissions</Text>
        </Button>
        <Button
          variant="link"
          className="w-full"
          onPress={() => router.replace("/")}
        >
          <Text>Skip for now</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default permission;
