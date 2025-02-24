import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { tokenCache } from "~/cache";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { ConvexReactClient } from "convex/react";
import * as SplashScreen from "expo-splash-screen";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { SahhaProvider } from "~/providers/SahhaProvider";

import "react-native-reanimated";
import "~/global.css";

import { useColorScheme } from "~/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Urbanist: require("../assets/fonts/Urbanist.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }

  return (
    <SahhaProvider>
      <ActionSheetProvider>
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
          <ClerkLoaded>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(home)" />
                  <Stack.Screen name="permission" />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
              </ThemeProvider>
            </ConvexProviderWithClerk>
          </ClerkLoaded>
        </ClerkProvider>
      </ActionSheetProvider>
    </SahhaProvider>
  );
}
