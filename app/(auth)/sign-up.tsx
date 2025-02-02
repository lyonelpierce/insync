import * as React from "react";
import { cn } from "~/lib/utils";
import { Text, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";

export default function SignUpScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");
  const [checked, setChecked] = React.useState(false);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      setError(""); // Clear any existing errors
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
        username,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      const errorMessage =
        err.errors?.[0]?.message || "Something went wrong during sign up";
      setError(errorMessage);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      setError(""); // Clear any existing errors
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        setError("Verification was not completed. Please try again.");
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: any) {
      const errorMessage =
        err.errors?.[0]?.message || "Something went wrong during verification";
      setError(errorMessage);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <View className="flex-1 bg-transparent justify-around items-center h-full gap-4 p-4">
        <View className="flex flex-col gap-4 w-full justify-center items-center">
          <Text className="text-white text-4xl font-semibold w-full flex items-center justify-start mb-2">
            Verify your email
          </Text>
          <Input
            value={code}
            placeholder="Enter verification code"
            onChangeText={(code) => setCode(code)}
            className="w-full bg-transparent border-[#A7A7A7] min-h-16 placeholder:text-[#A7A7A7] rounded-lg text-white"
          />
          {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
        </View>

        <View className="flex flex-col gap-4 w-full justify-center items-center">
          <Button
            onPress={onVerifyPress}
            disabled={!code}
            className="w-full bg-green-600 rounded-lg min-h-16"
          >
            <Text className="text-white">Verify Email</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-transparent justify-around items-center h-full gap-4 p-4">
      <View className="flex flex-col gap-4 w-full justify-center items-center">
        <Text className="text-white text-4xl font-semibold w-full flex items-center justify-start mb-2">
          Create account
        </Text>
        <View className="flex flex-row w-full items-center gap-2">
          <Input
            autoCapitalize="none"
            value={firstName}
            placeholder="Enter first name"
            onChangeText={(firstName) => setFirstName(firstName)}
            className="bg-transparent border-[#A7A7A7] min-h-14 placeholder:text-[#A7A7A7] rounded-lg w-[49%] text-white"
          />
          <Input
            autoCapitalize="none"
            value={lastName}
            placeholder="Enter last name"
            onChangeText={(lastName) => setLastName(lastName)}
            className="bg-transparent border-[#A7A7A7] min-h-14 placeholder:text-[#A7A7A7] rounded-lg w-[49%] text-white"
          />
        </View>

        <Input
          autoCapitalize="none"
          value={username}
          placeholder="Enter username"
          onChangeText={(email) => setUsername(email)}
          className="w-full bg-transparent border-[#A7A7A7] min-h-14 placeholder:text-[#A7A7A7] rounded-lg text-white"
        />
        <Input
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
          className="w-full bg-transparent border-[#A7A7A7] min-h-14 placeholder:text-[#A7A7A7] rounded-lg text-white"
        />
        <Input
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          className="w-full bg-transparent border-[#A7A7A7] min-h-14 placeholder:text-[#A7A7A7] rounded-lg text-white"
        />
        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      </View>

      <View className="flex flex-col gap-4 w-full justify-center items-center">
        <View className="flex flex-row gap-2 w-full justify-start">
          <Checkbox
            checked={checked}
            onCheckedChange={setChecked}
            className={cn(
              "border-[#A7A7A7] bg-transparent",
              checked && "bg-green-600"
            )}
          />

          <Label
            nativeID="airplane-mode"
            onPress={() => {
              setChecked((prev) => !prev);
            }}
            className="text-muted-foreground"
          >
            I agree to the Terms of Service and Privacy Policy
          </Label>
        </View>
        <Button
          onPress={onSignUpPress}
          disabled={!emailAddress || !password || !checked}
          className="w-full min-h-14 bg-green-600 rounded-lg"
        >
          <Text
            className={cn(
              "text-black font-semibold",
              emailAddress && password && checked && "text-white"
            )}
          >
            Continue
          </Text>
        </Button>
        <View className="flex flex-row gap-2 w-full justify-center items-center">
          <Text className="text-white">Already have an account?</Text>
          <Link href="/sign-in">
            <Text className="text-green-600">Login</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
