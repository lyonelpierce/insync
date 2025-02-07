import { BlurView } from "expo-blur";
import { View, Text } from "react-native";

const profile = () => {
  return (
    <View className="flex-1">
      <BlurView intensity={100} tint="dark" className="h-1/3 w-full">
        <Text className="text-white">asd</Text>
      </BlurView>
      <Text className="text-white">profile</Text>
    </View>
  );
};

export default profile;
