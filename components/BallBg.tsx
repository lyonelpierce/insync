import { BlurView } from "expo-blur";
import { View } from "react-native";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

const BallBg = () => {
  return (
    <View className="absolute inset-0 w-full h-full">
      <View className="absolute inset-0 bg-black w-full h-full" />

      {/* Top Right Ball with Diffuse Glow */}
      <View className="absolute top-[-200px] right-[-200px]">
        <Svg width={400} height={400}>
          <Defs>
            <RadialGradient id="grad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#4ADE80" stopOpacity="0.5" />
              <Stop offset="60%" stopColor="#4ADE80" stopOpacity="0.15" />
              <Stop offset="90%" stopColor="#4ADE80" stopOpacity="0.05" />
              <Stop offset="100%" stopColor="#4ADE80" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="200" cy="200" r="200" fill="url(#grad)" />
        </Svg>
      </View>

      {/* Middle Left Ball with Diffuse Glow */}
      <View className="absolute top-[30%] left-[-180px]">
        <Svg width={300} height={300}>
          <Defs>
            <RadialGradient id="grad2" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#4ADE80" stopOpacity="0.5" />
              <Stop offset="60%" stopColor="#4ADE80" stopOpacity="0.15" />
              <Stop offset="90%" stopColor="#4ADE80" stopOpacity="0.05" />
              <Stop offset="100%" stopColor="#4ADE80" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="150" cy="150" r="150" fill="url(#grad2)" />
        </Svg>
      </View>

      {/* Bottom Right Ball with Diffuse Glow */}
      <View className="absolute bottom-[-240px] right-[-240px]">
        <Svg width={400} height={400}>
          <Defs>
            <RadialGradient id="grad3" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#4ADE80" stopOpacity="0.5" />
              <Stop offset="60%" stopColor="#4ADE80" stopOpacity="0.15" />
              <Stop offset="90%" stopColor="#4ADE80" stopOpacity="0.05" />
              <Stop offset="100%" stopColor="#4ADE80" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="200" cy="200" r="200" fill="url(#grad3)" />
        </Svg>
      </View>

      <BlurView intensity={100} tint="dark" className="absolute inset-0" />
    </View>
  );
};

export default BallBg;
