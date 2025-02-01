import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import { Button } from "~/components/ui/button";

const landing = () => {
  const router = useRouter();

  return (
    <View className="flex-1 w-full h-full items-center justify-center">
      <View className="flex flex-col justify-around h-full gap-4">
        <View className="flex flex-col gap-4">
          <Text className="text-green-400 text-2xl font-bold">InSync</Text>
          <Text className="text-white">The best way to manage your money</Text>
        </View>

        <View className="flex flex-col gap-6">
          <Button
            onPress={() => router.push("/sign-up")}
            className="bg-green-600 rounded-lg"
          >
            <Text className="text-white">Sign Up</Text>
          </Button>
          <Button
            onPress={() => router.push("/sign-in")}
            className="bg-transparent border border-white rounded-lg"
          >
            <Text className="text-white">Login</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default landing;
