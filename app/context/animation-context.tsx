import { createContext, useContext } from "react";
import { SharedValue } from "react-native-reanimated";

type AnimationContextType = {
  headerTranslateY: SharedValue<number>;
};

export const AnimationContext = createContext<AnimationContextType | null>(
  null
);

export const useAnimationContext = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error(
      "useAnimationContext must be used within AnimationProvider"
    );
  }
  return context;
};
