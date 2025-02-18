import { View } from "react-native";
import { Image } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Button } from "~/components/ui/button";
import { Ionicons } from "@expo/vector-icons";

export default function ViewImage() {
  const { imageUrl } = useLocalSearchParams<{ imageUrl: string }>();

  return (
    <View className="flex-1 bg-black">
      <View className="absolute top-12 left-4 z-10">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="white" />
        </Button>
      </View>
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          className="flex-1"
          resizeMode="contain"
        />
      )}
    </View>
  );
}
