import React from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "~/components/ui/button";
import { Ionicons } from "@expo/vector-icons";

const ImageModal = () => {
  const { url } = useLocalSearchParams<{
    url: string;
  }>();

  return (
    <GestureHandlerRootView>
      <View className="flex-1 bg-black pb-24">
        <ImageZoom
          uri={url}
          resizeMode="contain"
          minScale={0.5}
          maxScale={5}
          isDoubleTapEnabled
          isSingleTapEnabled
          doubleTapScale={2}
          className="w-full h-full"
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default ImageModal;
