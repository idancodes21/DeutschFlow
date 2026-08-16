import { Ionicons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";

export default function HomeHeader() {
  return (
    <View className="relative">
      <Image
        source={require("../../../assets/images/headerbg2.png")}
        style={{
          width: "100%",
          height: 310,
        }}
        resizeMode="cover"
      />

      <View className="absolute left-0 right-0 top-0 px-5 pt-10">
        <View className="absolute right-5 top-10">
          <Ionicons name="notifications-outline" size={27} color="#161A2A" />

          <View className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
        </View>
        <Text className="font-fredoka-semibold text-3xl text-[#161A2A]">
          Hello, Collins! 👋
        </Text>

        <Text className="mt-2 max-w-[220px] font-nunito text-base leading-6 text-[#555968]">
          Let's learn German together step by step.
        </Text>

        <View className="mt-5 flex-row gap-3">
          <View className="flex-row items-center rounded-full border border-gray-200 bg-white px-3 py-2">
            <Text className="mr-1 text-sm">🔥</Text>

            <Text className="font-nunito-semibold text-sm text-[#161A2A]">
              7 day streak
            </Text>
          </View>

          <View className="flex-row items-center rounded-full border border-gray-200 bg-white px-3 py-2">
            <Text className="mr-1 text-sm">⭐</Text>

            <Text className="font-nunito-semibold text-sm text-[#161A2A]">
              820 XP
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
