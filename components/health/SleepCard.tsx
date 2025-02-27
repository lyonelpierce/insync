import React, { useState } from "react";
import { View, Text } from "react-native";
import { BedSingleIcon } from "lucide-react-native";

const SleepCard = ({ steps }: { steps: any }) => {
  return (
    <View className="p-4 bg-[#353D48]/25 rounded-3xl w-full flex flex-row items-center justify-between">
      <BedSingleIcon color="white" size={32} />
      <View className="flex flex-col items-center">
        <Text className="text-white text-lg font-medium">Steps</Text>
        <Text className="text-white text-lg font-medium">10,000</Text>
      </View>
    </View>
  );
};

export default SleepCard;
