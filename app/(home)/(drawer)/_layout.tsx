import { View, Dimensions, Modal, Pressable, Image } from "react-native";
import * as Linking from "expo-linking";
import BallBg from "~/components/BallBg";
import { Drawer } from "expo-router/drawer";
import { Text } from "~/components/ui/text";
import { useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "~/components/ui/button";
import { PencilIcon } from "lucide-react-native";
import { router, usePathname } from "expo-router";
import { Separator } from "~/components/ui/separator";
import { useUserProfile } from "~/hooks/useUserProfile";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useState } from "react";

const CustomDrawerContent = (props: any) => {
  const { signOut } = useClerk();
  const { userProfile, isLoading } = useUserProfile();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  if (isLoading || !userProfile) {
    return <Text>Loading...</Text>;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to your desired page
      Linking.openURL(Linking.createURL("/(auth)/landing"));
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View className="flex-col gap-2 items-center justify-center relative">
        <Pressable onPress={() => setShowAvatarModal(true)}>
          <Avatar alt="User Avatar" className="w-20 h-20">
            <AvatarImage source={{ uri: userProfile.imageUrl ?? undefined }} />
            <AvatarFallback>
              <Text>{userProfile.first_name?.charAt(0)}</Text>
            </AvatarFallback>
          </Avatar>
        </Pressable>
        <Text className="text-white text-lg font-bold">
          {userProfile.first_name} {userProfile.last_name}
        </Text>
        <Text className="text-[#A7A7A7] text-sm">@{userProfile.username}</Text>
        <View className="absolute top-0 right-4">
          <Button variant="ghost" size="icon">
            <PencilIcon
              size={24}
              color={"#D9D9D9"}
              onPress={() => router.push("/(home)/(modal)/editprofile")}
            />
          </Button>
        </View>
        <View className="absolute top-0 left-4">
          <Button variant="ghost" size="icon">
            <Ionicons name="settings-outline" size={24} color={"#D9D9D9"} />
          </Button>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={showAvatarModal}
          onRequestClose={() => setShowAvatarModal(false)}
        >
          <Pressable
            className="flex-1 bg-black/90 items-center justify-center"
            onPress={() => setShowAvatarModal(false)}
          >
            <Image
              source={{ uri: userProfile.imageUrl ?? undefined }}
              style={{ width: screenWidth, height: screenHeight * 0.8 }}
              resizeMode="contain"
            />
          </Pressable>
        </Modal>
      </View>
      <Separator className="bg-[#535F70] my-8" />
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons name="person-outline" color={"#FCFCFB"} size={size} />
        )}
        label="Profile"
        labelStyle={{ color: "#FCFCFB", fontSize: 18 }}
        onPress={() => router.push("/(home)/(drawer)/(tabs)/profile")}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons name="bookmark-outline" color={"#FCFCFB"} size={size} />
        )}
        label="Bookmarks"
        labelStyle={{ color: "#FCFCFB", fontSize: 18 }}
        onPress={() => router.push("/")}
      />
      <Separator className="bg-[#535F70] my-8" />
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons name="settings-outline" color={"#FCFCFB"} size={size} />
        )}
        label="Settings"
        labelStyle={{ color: "#FCFCFB", fontSize: 18 }}
        onPress={() => router.push("/")}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons name="log-out-outline" color={"#FCFCFB"} size={size} />
        )}
        label="Logout"
        labelStyle={{ color: "#FCFCFB", fontSize: 18 }}
        onPress={handleSignOut}
      />
    </DrawerContentScrollView>
  );
};

const _layout = () => {
  const { userProfile, isLoading } = useUserProfile();
  const pathname = usePathname();
  const [showHeaderAvatarModal, setShowHeaderAvatarModal] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  if (isLoading || !userProfile) {
    return <Text>Loading...</Text>;
  }

  return (
    <ActionSheetProvider>
      <View className="flex-1">
        <BallBg />
        <Drawer
          drawerContent={(props) => (
            <CustomDrawerContent {...props} backgroundColor="#353d48" />
          )}
          screenOptions={({ navigation }) => ({
            sceneStyle: { backgroundColor: "transparent" },
            headerShown: false,
            headerStyle: { backgroundColor: "transparent" },
            headerTitleStyle: { color: "white" },
            headerLeft: () => (
              <View>
                <Button
                  size="icon"
                  variant="ghost"
                  style={{ marginLeft: 12 }}
                  onPress={() => navigation.openDrawer()}
                >
                  <Pressable onPress={() => setShowHeaderAvatarModal(true)}>
                    <Avatar alt="User Avatar">
                      <AvatarImage
                        source={{ uri: userProfile.imageUrl ?? undefined }}
                      />
                      <AvatarFallback>
                        <Text>{userProfile.first_name?.charAt(0)}</Text>
                      </AvatarFallback>
                    </Avatar>
                  </Pressable>
                </Button>

                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={showHeaderAvatarModal}
                  onRequestClose={() => setShowHeaderAvatarModal(false)}
                >
                  <Pressable
                    className="flex-1 bg-black/90 items-center justify-center"
                    onPress={() => setShowHeaderAvatarModal(false)}
                  >
                    <Image
                      source={{ uri: userProfile.imageUrl ?? undefined }}
                      style={{ width: screenWidth, height: screenHeight * 0.8 }}
                      resizeMode="contain"
                    />
                  </Pressable>
                </Modal>
              </View>
            ),
            headerRight: () => (
              <View style={{ paddingRight: 12 }}>
                <Button size="icon" variant="ghost">
                  <Ionicons name="search-outline" size={24} color="white" />
                </Button>
              </View>
            ),
            headerTitle: "InSync",
          })}
        >
          <Drawer.Screen name="(tabs)" />
        </Drawer>
      </View>
    </ActionSheetProvider>
  );
};

export default _layout;
