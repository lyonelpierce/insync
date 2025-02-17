import { useState } from "react";
import { useMutation } from "convex/react";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { Button } from "~/components/ui/button";
import * as ImagePicker from "expo-image-picker";
import { Textarea } from "~/components/ui/textarea";
import { useUserProfile } from "~/hooks/useUserProfile";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { CameraIcon, ImageIcon } from "lucide-react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Create = () => {
  const router = useRouter();
  const addPost = useMutation(api.posts.addPost);
  const { userProfile, isLoading } = useUserProfile();
  const [postContent, setPostContent] = useState("");
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const [mediaFiles, setMediaFiles] = useState<ImagePicker.ImagePickerAsset[]>(
    []
  );

  if (isLoading || !userProfile) {
    return <Text>Loading...</Text>;
  }

  const handleSubmit = async () => {
    const mediaStorageIds = await Promise.all(
      mediaFiles.map((file) => uploadMediaFile(file))
    );
    addPost({
      content: postContent,
      mediaFiles: mediaStorageIds,
      created_at: new Date().toISOString(),
    });
    setPostContent("");
    setMediaFiles([]);

    router.dismiss();
  };

  const selectImage = async (source: "camera" | "library") => {
    const options: ImagePicker.ImagePickerOptions = {
      allowsEditing: true,
      aspect: [4, 3],
      mediaTypes: ["images", "videos"],
    };

    let result;

    if (source === "camera") {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled) {
      setMediaFiles([result.assets[0], ...mediaFiles]);
    }
  };

  const removeImage = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const uploadMediaFile = async (image: ImagePicker.ImagePickerAsset) => {
    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();

    // Convert URI to blob
    const response = await fetch(image!.uri);
    const blob = await response.blob();

    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": image!.mimeType! },
      body: blob,
    });
    const { storageId } = await result.json();
    return storageId;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-[#353D48]">
        <View className="px-4 py-2">
          <View className="flex-row items-start gap-2">
            <Avatar alt="User Avatar">
              <AvatarImage
                source={{ uri: userProfile?.imageUrl || undefined }}
              />
              <AvatarFallback>
                <Text>
                  {userProfile?.first_name?.charAt(0)}
                  {userProfile?.last_name?.charAt(0)}
                </Text>
              </AvatarFallback>
            </Avatar>
            <Textarea
              value={postContent}
              onChangeText={setPostContent}
              placeholder="How are you feeling today?"
              className="flex-1 bg-transparent border-0 text-white"
              multiline
              autoFocus={true}
            />
          </View>

          {mediaFiles.length > 0 && (
            <ScrollView horizontal className="mt-4">
              {mediaFiles.map((file, index) => (
                <View key={index} className="relative mr-2">
                  <Image
                    source={{ uri: file.uri }}
                    className="w-24 h-24 rounded-lg"
                  />
                  <TouchableOpacity
                    onPress={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <View className="flex-row px-4 items-center justify-between">
          <View className="flex-row">
            <Button onPress={() => selectImage("library")} variant="ghost">
              <ImageIcon size={24} color="white" />
            </Button>
            <Button onPress={() => selectImage("camera")} variant="ghost">
              <CameraIcon size={24} color="white" />
            </Button>
            <Button variant="ghost">
              <Text className="text-white font-bold">GIF</Text>
            </Button>
          </View>
          <Button onPress={handleSubmit} disabled={!postContent.trim()}>
            <Text className="text-white font-bold">Post</Text>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Create;
