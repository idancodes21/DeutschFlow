import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function DailyTip() {
  return (
    <View className="mt-6 px-5">
      <View className="flex-row items-center rounded-2xl border border-gray-100 bg-white p-4">
        {/* Icon */}
        <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-yellow-light">
          <Ionicons name="bulb" size={25} color="#F5B82E" />
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text className="font-fredoka-semibold text-base text-[#161A2A]">
            Daily Tip
          </Text>

          <Text className="mt-1 font-nunito-semibold text-sm text-[#161A2A]">
            "Guten Morgen" is used mainly in the morning.
          </Text>

          <Text className="mt-1 font-nunito text-xs leading-4 text-[#777B87]">
            It literally means "Good morning."
          </Text>
        </View>
      </View>
    </View>
  );
}
