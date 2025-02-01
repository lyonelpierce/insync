import React from "react";

import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { View } from "react-native";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

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
        router.replace("/");
      } else {
        setError("Sign in was not completed. Please try again.");
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
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
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
          className="w-full bg-transparent border-[#A7A7A7] min-h-16 placeholder:text-[#A7A7A7] rounded-lg text-white"
        />
        <Input
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          className="w-full bg-transparent border-[#A7A7A7] min-h-16 placeholder:text-[#A7A7A7] rounded-lg text-white"
        />
        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      </View>

      <View className="flex flex-col gap-4 w-full justify-center items-center">
        <Button
          onPress={onSignInPress}
          disabled={!emailAddress || !password}
          className="w-full min-h-16 bg-green-600 rounded-lg"
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
