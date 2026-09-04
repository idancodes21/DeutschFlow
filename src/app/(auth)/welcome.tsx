import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6">
        {/* Logo */}
        <View className="items-center pt-8">
          <Text className="mt-3 font-fredoka-semibold text-2xl text-[#161A2A]">
            DeutschFlow
          </Text>
        </View>

        {/* Illustration */}
        <View className="flex-1 items-center justify-center">
          <Image
            source={require("../../../assets/images/hallo.jpg")}
            className="h-64 w-64"
            resizeMode="contain"
          />

          <Text className="mt-4 text-center font-fredoka-semibold text-3xl text-[#161A2A]">
            Learn German
          </Text>

          <Text className="mt-2 max-w-[320px] text-center font-nunito text-base leading-6 text-[#555968]">
            Learn vocabulary, grammar, listening and speaking step by step.
          </Text>
        </View>

        {/* Actions */}
        <View className="pb-6">
          <TouchableOpacity
            onPress={() => router.push("/signup")}
            className="h-14 items-center justify-center rounded-2xl bg-primary"
          >
            <Text className="font-nunito-bold text-base text-white">
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="mt-4 h-14 flex-row items-center justify-center rounded-2xl border border-gray-200 bg-white"
          >
            <Text className="font-nunito-bold text-base text-[#161A2A]">
              I already have an account
            </Text>

            <Ionicons
              name="arrow-forward"
              size={18}
              color="#161A2A"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
