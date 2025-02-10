import { useState } from "react";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import * as ImagePicker from "expo-image-picker";
import { Textarea } from "~/components/ui/textarea";
import { useUserProfile } from "~/hooks/useUserProfile";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { CameraIcon, ImagePlayIcon, ImageIcon } from "lucide-react-native";

const Create = () => {
  const { userProfile, isLoading } = useUserProfile();
  const [mediaFiles, setMediaFiles] = useState<ImagePicker.ImagePickerAsset[]>(
    []
  );

  if (isLoading || !userProfile) {
    return <Text>Loading...</Text>;
  }

  const selectImage = async (source: "camera" | "library") => {
    const options: ImagePicker.ImagePickerOptions = {
      allowsEditing: true,
      aspect: [4, 3],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    };

    let result;

    if (source === "camera") {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled) {
      setMediaFiles([result.assets[0], ...mediaFiles]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-[#353D48]">
        <View className="px-4 py-2 flex-row items-start justify-start gap-2">
          <Avatar alt="User Avatar">
            <AvatarImage source={{ uri: userProfile?.imageUrl || undefined }} />
            <AvatarFallback>
              <Text>
                {userProfile?.first_name?.charAt(0)}
                {userProfile?.last_name?.charAt(0)}
              </Text>
            </AvatarFallback>
          </Avatar>
          <Textarea
            placeholder="What's on your heart?"
            className="bg-transparent border-0 text-white"
            multiline
            autoFocus={true}
          />
        </View>
        <View className="flex-row">
          <Button onPress={() => selectImage("library")} variant="ghost">
            <ImageIcon size={24} color="white" />
          </Button>
          <Button onPress={() => selectImage("camera")} variant="ghost">
            <CameraIcon size={24} color="white" />
          </Button>
          <Button variant="ghost">
            <ImagePlayIcon size={24} color="white" />
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Create;
