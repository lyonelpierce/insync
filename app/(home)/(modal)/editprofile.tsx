import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import createClerkSupabaseClient from "~/utils/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { Camera } from "lucide-react-native";

const editprofile = () => {
  const { user, isLoaded } = useUser();
  const supabase = createClerkSupabaseClient();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    firstName: "",
    lastName: "",
    bio: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define the query
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id, // Only run query when user.id is available
  });

  // Update local state when userData changes
  useEffect(() => {
    if (userData) {
      setUsername(userData.username);
      setFirstName(userData.first_name);
      setLastName(userData.last_name);
      setBio(userData.bio);
    }
  }, [userData]);

  // Add username validation function
  const validateUsername = async (newUsername: string) => {
    // Remove @ if present at the start
    const cleanUsername = newUsername.replace(/^@/, "");

    // Basic validation
    if (cleanUsername.length < 3) {
      setErrors((prev) => ({
        ...prev,
        username: "Username must be at least 3 characters long",
      }));
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      setErrors((prev) => ({
        ...prev,
        username: "Username can only contain letters, numbers, and underscores",
      }));
      return false;
    }

    // Check username uniqueness in Supabase
    const { data: existingUser } = await supabase
      .from("users")
      .select("username")
      .eq("username", cleanUsername)
      .neq("id", user?.id) // Exclude current user
      .single();

    if (existingUser) {
      setErrors((prev) => ({ ...prev, username: "Username is already taken" }));
      return false;
    }

    setErrors((prev) => ({ ...prev, username: "" }));
    return true;
  };

  // Add validation for other fields
  const validateFields = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const isUsernameValid = await validateUsername(username);
      const areFieldsValid = validateFields();

      if (!isUsernameValid || !areFieldsValid) {
        return;
      }

      const cleanUsername = username.replace(/^@/, "");

      const { error: updateError } = await supabase
        .from("users")
        .update({
          username: cleanUsername,
          first_name: firstName,
          last_name: lastName,
          bio: bio,
        })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      // You might want to add a success message or navigation here
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded || isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    console.log(error);
    return <Text>Error loading profile</Text>;
  }

  return (
    <View className="flex-1 items-center bg-[#353D48] p-6">
      <View className="relative">
        <Avatar alt="User Avatar" className="w-40 h-40">
          <AvatarImage source={{ uri: user?.imageUrl }} />
          <AvatarFallback>
            <Text>{user?.firstName?.charAt(0)}</Text>
          </AvatarFallback>
        </Avatar>
        <Button className="absolute bottom-0 right-0 rounded-full aspect-square bg-green-600 flex items-center justify-center p-0">
          <Camera size={26} color="white" />
        </Button>
      </View>
      <View className="flex flex-col gap-6 w-full mt-12">
        <View>
          <Input
            className="w-full bg-transparent border-[#A7A7A7] text-[#FCFCFB] placeholder:text-[#A7A7A7] rounded-xl min-h-14"
            value={username.startsWith("@") ? username : `@${username}`}
            onChangeText={(text) => {
              setUsername(text);
              validateUsername(text);
            }}
          />
          {errors.username ? (
            <Text className="text-red-500 mt-1 text-sm">{errors.username}</Text>
          ) : null}
        </View>

        <View>
          <Input
            className="w-full bg-transparent border-[#A7A7A7] text-[#FCFCFB] placeholder:text-[#A7A7A7] rounded-xl min-h-14"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              setErrors((prev) => ({ ...prev, firstName: "" }));
            }}
          />
          {errors.firstName ? (
            <Text className="text-red-500 mt-1 text-sm">
              {errors.firstName}
            </Text>
          ) : null}
        </View>

        <View>
          <Input
            className="w-full bg-transparent border-[#A7A7A7] text-[#FCFCFB] placeholder:text-[#A7A7A7] rounded-xl min-h-14"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              setErrors((prev) => ({ ...prev, lastName: "" }));
            }}
          />
          {errors.lastName ? (
            <Text className="text-red-500 mt-1 text-sm">{errors.lastName}</Text>
          ) : null}
        </View>

        <View>
          <Textarea
            className="w-full bg-transparent border-[#A7A7A7] text-[#FCFCFB] placeholder:text-[#A7A7A7] rounded-xl"
            value={bio}
            onChangeText={(text) => {
              setBio(text);
              setErrors((prev) => ({ ...prev, bio: "" }));
            }}
            placeholder="Type your bio here..."
          />
          {errors.bio ? (
            <Text className="text-red-500 mt-1 text-sm">{errors.bio}</Text>
          ) : null}
        </View>

        <Button
          className="w-full bg-green-600 rounded-xl min-h-14"
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text className="text-white font-bold">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default editprofile;
