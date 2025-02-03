import { View } from "react-native";
import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { Drawer } from "expo-router/drawer";
import { Text } from "~/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

const CustomDrawerContent = (props: any) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

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
        onPress={() => router.push("/")}
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
        onPress={() => router.push("/")}
      />
    </DrawerContentScrollView>
  );
};

const _layout = () => {
  return (
    <Drawer
      drawerContent={(props) => (
        <CustomDrawerContent {...props} backgroundColor="#393D42" />
      )}
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default _layout;
