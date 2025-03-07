import React from "react";
import { BlurView } from "expo-blur";
import { View, Text } from "react-native";
import { useConvexAuth } from "convex/react";
import { ImageBackground } from "react-native";
import { Button } from "~/components/ui/button";
import { Redirect, useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";

const index = () => {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (!isLoading && isAuthenticated) {
    return <Redirect href="/(home)/(drawer)/(tabs)" />;
  }

  return (
    <ImageBackground
      source={require("../assets/images/bg.jpg")}
      className="h-full w-full"
    >
      <View className="flex-1 items-center justify-end">
        <View className="h-1/2 w-full">
          <BlurView
            intensity={100}
            tint="dark"
            className="w-full h-full flex items-center justify-center gap-8"
            style={{
              overflow: "hidden",
              borderTopLeftRadius: 200,
              borderTopRightRadius: 200,
              transform: [{ scaleX: 1.75 }],
            }}
          >
            <View
              style={{ transform: [{ scaleX: 1 / 1.75 }] }}
              className="flex items-center justify-center w-2/3 gap-8"
            >
              <Text className="text-4xl text-white text-center font-semibold">
                Welcome to{" "}
                <Text className="text-green-600 underline">InSync</Text> App
              </Text>
              <Text className="text-gray-400 text-xl">
                The wearable social network
              </Text>
              <Button
                className="rounded-full min-h-20 w-20 bg-green-600"
                onPress={() => router.push("/(auth)/landing")}
              >
                <Text className="bg-white rounded-full p-1">
                  <ChevronRight color="#16a34a" />
                </Text>
              </Button>
            </View>
          </BlurView>
        </View>
      </View>
    </ImageBackground>
  );
};

export default index;
