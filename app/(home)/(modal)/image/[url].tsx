import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const ImageModal = () => {
  const { url } = useLocalSearchParams<{
    url: string;
  }>();

  return (
    <GestureHandlerRootView>
      <View className="flex-1 bg-black">
        <ImageZoom
          uri={url}
          resizeMode="contain"
          minScale={0.5}
          maxScale={5}
          isDoubleTapEnabled
          isSingleTapEnabled
          className="w-full h-full"
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default ImageModal;
