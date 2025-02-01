import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import BallBg from "~/components/BallBg";
import { Button } from "~/components/ui/button";
import { SignOutButton } from "~/components/ui/SignOutButton";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center">
      <BallBg />
      <SignedIn>
        <Text className="text-white">
          Hello {user?.emailAddresses[0].emailAddress}
        </Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Button onPress={() => router.push("/sign-in")}>
          <Text>Sign in</Text>
        </Button>
        <Button onPress={() => router.push("/sign-up")}>
          <Text>Sign up</Text>
        </Button>
      </SignedOut>
    </View>
  );
}
