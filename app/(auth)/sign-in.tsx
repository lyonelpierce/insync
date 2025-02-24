import React from "react";
import { cn } from "~/lib/utils";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "~/components/ui/input";
import { Link, useRouter } from "expo-router";
import { Button } from "~/components/ui/button";
import { useSahha } from "~/providers/SahhaProvider";

export default function Page() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isAuthenticated, sensorStatus } = useSahha();

  const [error, setError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  // Handle the submission of the sign-in form
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return;

    try {
      setError(""); // Clear any existing errors
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });

        if (isAuthenticated && sensorStatus === 3) {
          router.replace("/");
        } else {
          router.replace("/permission");
        }
      } else {
        setError("Sign in was not completed. Please try again.");
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.log("Error", err);

      const errorMessage =
        err.errors?.[0]?.message || "Something went wrong during sign in";
      setError(errorMessage);
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <View className="flex-1 bg-transparent justify-around items-center h-full gap-4 p-4">
      <View className="flex flex-col gap-4 w-full justify-center items-center">
        <Text className="text-white text-4xl font-semibold w-full flex items-center justify-start mb-2">
          Sign in
        </Text>
        <Input
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Username or email"
          onChangeText={(email) => setEmailAddress(email)}
          className="w-full bg-transparent border-[#A7A7A7] min-h-14 placeholder:text-[#A7A7A7] rounded-lg text-white"
        />
        <View className="w-full relative h-14">
          <Input
            value={password}
            placeholder="Enter password"
            secureTextEntry={!showPassword}
            onChangeText={(password) => setPassword(password)}
            className="w-full bg-transparent border-[#A7A7A7] min-h-14 placeholder:text-[#A7A7A7] rounded-lg text-white pr-12"
          />
          <Button
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 justify-center"
            variant="ghost"
            size="icon"
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#A7A7A7"
            />
          </Button>
        </View>
        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      </View>

      <View className="flex flex-col gap-4 w-full justify-center items-center">
        <Button
          onPress={onSignInPress}
          disabled={!emailAddress || !password}
          className="w-full min-h-14 bg-green-600 rounded-lg"
        >
          <Text
            className={cn(
              "text-black font-semibold",
              emailAddress && password && "text-white"
            )}
          >
            Sign in
          </Text>
        </Button>
        <View className="flex flex-row gap-2 w-full justify-center items-center">
          <Text className="text-white">Don't have an account?</Text>
          <Link href="/(auth)/sign-up">
            <Text className="text-green-600">Sign up</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
