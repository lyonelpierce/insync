import { View } from "react-native";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import { Drawer } from "expo-router/drawer";
import { Text } from "~/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import BallBg from "~/components/BallBg";

const CustomDrawerContent = (props: any) => {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
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
      <View className="flex-col gap-2 items-center justify-center">
        <Avatar alt="User Avatar" className="w-20 h-20">
          <AvatarImage source={{ uri: user?.imageUrl }} />
          <AvatarFallback>
            <Text>{user?.firstName?.charAt(0)}</Text>
          </AvatarFallback>
        </Avatar>
        <Text className="text-white text-lg font-bold">
          {user?.firstName} {user?.lastName}
        </Text>
        <Text className="text-[#A7A7A7] text-sm">@{user?.username}</Text>
      </View>
      <Separator className="bg-[#535F70] my-8" />
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons name="person-outline" color={"#FCFCFB"} size={size} />
        )}
        label="Profile"
        labelStyle={{ color: "#FCFCFB", fontSize: 18 }}
        onPress={() => router.push("/(home)/(drawer)/profile")}
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
  return (
    <View className="flex-1">
      <BallBg />
      <Drawer
        drawerContent={(props) => (
          <CustomDrawerContent {...props} backgroundColor="#393D42" />
        )}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: "transparent" },
        }}
      >
        <Drawer.Screen name="profile" />
      </Drawer>
    </View>
  );
};

export default _layout;
