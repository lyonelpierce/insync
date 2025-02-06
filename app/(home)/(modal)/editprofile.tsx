import { View, Text } from "react-native";
import { useMutation } from "convex/react";
import { Camera } from "lucide-react-native";
import { Input } from "~/components/ui/input";
import { api } from "~/convex/_generated/api";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import * as ImagePicker from "expo-image-picker";
import { Id } from "~/convex/_generated/dataModel";
import { Textarea } from "~/components/ui/textarea";
import { useUserProfile } from "~/hooks/useUserProfile";
import { useState, useEffect, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useActionSheet } from "@expo/react-native-action-sheet";

// Add interface for errors
interface FormErrors {
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
}

const initialErrors: FormErrors = {
  username: "",
  firstName: "",
  lastName: "",
  bio: "",
};

const editprofile = () => {
  const { userProfile } = useUserProfile();

  const updateUser = useMutation(api.users.updateUser);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateImage = useMutation(api.users.updateImage);

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const router = useRouter();

  const [errors, setErrors] = useState<FormErrors>(initialErrors);

  const { showActionSheetWithOptions } = useActionSheet();

  const onDone = async () => {
    try {
      if (!userProfile?._id) {
        console.error("User profile not found");
        return;
      }

      await updateUser({
        _id: userProfile._id,
        bio,
        // websiteUrl: link,
        first_name: firstName,
        last_name: lastName,
      });

      if (selectedImage) {
        await updateProfilePicture();
      }
      router.dismiss();
    } catch (error) {
      console.error("Error in onDone:", error);
    }
  };

  const updateProfilePicture = async () => {
    try {
      if (!userProfile?._id) {
        console.error("User profile not found");
        return;
      }

      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();

      // Convert URI to blob
      const response = await fetch(selectedImage!.uri);
      const blob = await response.blob();

      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage!.mimeType! },
        body: blob,
      });
      const { storageId } = await result.json();

      // Step 3: Save the newly allocated storage id to the database
      await updateImage({
        storageId: storageId as Id<"_storage">,
        _id: userProfile._id,
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      throw error;
    }
  };

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (
      cameraPermission.status !== "granted" ||
      libraryPermission.status !== "granted"
    ) {
      alert(
        "Sorry, we need camera and photo library permissions to make this work!"
      );
      return false;
    }
    return true;
  };

  const selectImage = async () => {
    // Request permissions first
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    const options = ["Take Photo", "Choose from Library", "Cancel"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (selectedIndex) => {
        try {
          let result;
          if (selectedIndex === 0) {
            // Take photo
            result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });
          } else if (selectedIndex === 1) {
            // Choose from library
            result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });
          }

          if (result && !result.canceled) {
            setSelectedImage(result.assets[0]);
          }
        } catch (error) {
          console.error("Error selecting image:", error);
          alert("Error accessing camera or photo library");
        }
      }
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fix type for setErrors callbacks
  const validateUsername = useCallback(async (newUsername: string) => {
    const cleanUsername = newUsername.replace(/^@/, "");

    if (cleanUsername.length < 4) {
      setErrors((prev: FormErrors) => ({
        ...prev,
        username: "Username must be at least 4 characters long",
      }));
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      setErrors((prev: FormErrors) => ({
        ...prev,
        username: "Username can only contain letters, numbers, and underscores",
      }));
      return false;
    }

    setErrors((prev: FormErrors) => ({ ...prev, username: "" }));
    return true;
  }, []);

  // Update handleSubmit to use onDone
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onDone();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set initial values from userProfile
  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username || "");
      setFirstName(userProfile.first_name || "");
      setLastName(userProfile.last_name || "");
      setBio(userProfile.bio || "");
    }
  }, [userProfile]);

  return (
    <View className="flex-1 items-center bg-[#353D48] p-6">
      <View className="relative">
        <Avatar alt="User Avatar" className="w-40 h-40">
          <AvatarImage
            source={{
              uri:
                selectedImage?.uri ||
                userProfile?.imageUrl ||
                "fallback-uri-here",
            }}
          />
          <AvatarFallback>
            <Text>{userProfile?.first_name?.charAt(0)}</Text>
          </AvatarFallback>
        </Avatar>
        <Button
          className="absolute bottom-0 right-0 rounded-full aspect-square bg-green-600 flex items-center justify-center p-0"
          onPress={selectImage}
        >
          <Camera size={26} color="white" />
        </Button>
      </View>
      <View className="flex flex-col gap-10 w-full mt-12">
        <View className="relative">
          <View className="absolute -top-3 left-4 px-1 bg-[#353D48] text-sm text-[#A7A7A7] z-10">
            <Label className="text-[#FCFCFB]">Username</Label>
          </View>
          <Input
            className="w-full bg-transparent border-[#A7A7A7] text-[#FCFCFB] placeholder:text-[#A7A7A7] rounded-xl min-h-16"
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

        <View className="relative">
          <View className="absolute -top-3 left-4 px-1 bg-[#353D48] text-sm text-[#A7A7A7] z-10">
            <Label className="text-[#FCFCFB]">First Name</Label>
          </View>
          <Input
            className="w-full bg-transparent border-[#A7A7A7] text-[#FCFCFB] placeholder:text-[#A7A7A7] rounded-xl min-h-16"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              setErrors((prev: FormErrors) => ({ ...prev, firstName: "" }));
            }}
          />
          {errors.firstName ? (
            <Text className="text-red-500 mt-1 text-sm">
              {errors.firstName}
            </Text>
          ) : null}
        </View>

        <View className="relative">
          <View className="absolute -top-3 left-4 px-1 bg-[#353D48] text-sm text-[#A7A7A7] z-10">
            <Label className="text-[#FCFCFB]">Last Name</Label>
          </View>
          <Input
            className="w-full bg-transparent border-[#A7A7A7] text-[#FCFCFB] placeholder:text-[#A7A7A7] rounded-xl min-h-16"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              setErrors((prev: FormErrors) => ({ ...prev, lastName: "" }));
            }}
          />
          {errors.lastName ? (
            <Text className="text-red-500 mt-1 text-sm">{errors.lastName}</Text>
          ) : null}
        </View>

        <View className="relative">
          <View className="absolute -top-3 left-4 px-1 bg-[#353D48] text-sm text-[#A7A7A7] z-10">
            <Label className="text-[#FCFCFB]">Bio</Label>
          </View>
          <Textarea
            className="w-full bg-transparent border-[#A7A7A7] text-[#FCFCFB] placeholder:text-[#A7A7A7] placeholder:text-base rounded-xl min-h-16"
            value={bio}
            onChangeText={(text) => {
              setBio(text);
              setErrors((prev: FormErrors) => ({ ...prev, bio: "" }));
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
