import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#6554C0" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#6554C0",
        tabBarInactiveTintColor: "#777B87",

        tabBarStyle: {
          height: 68 + insets.bottom,
          paddingTop: 7,
          paddingBottom: insets.bottom + 8,

          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E7E7EA",
          elevation: 0,
        },

        tabBarLabelStyle: {
          fontFamily: "NunitoSemiBold",
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "book" : "book-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="practice"
        options={{
          title: "Practice",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "fitness" : "fitness-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="speak"
        options={{
          title: "Speak",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "mic" : "mic-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
