import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface FocusCardProps {
  title: string;
  description: string;
  duration: string;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  iconBackground: string;
  iconColor: string;
}

export default function FocusCard({
  title,
  description,
  duration,
  icon,
  backgroundColor,
  iconBackground,
  iconColor,
}: FocusCardProps) {
  return (
    <View className={`flex-1 rounded-2xl ${backgroundColor} p-4`}>
      <View
        className={`mb-4 h-10 w-10 items-center justify-center rounded-full ${iconBackground}`}
      >
        <Ionicons name={icon} size={20} color="white" />
      </View>

      <Text className="font-fredoka-semibold text-base text-[#161A2A]">
        {title}
      </Text>

      <Text className="mt-1 font-nunito text-xs leading-4 text-[#555968]">
        {description}
      </Text>

      <View className="mt-5 flex-row items-center justify-between">
        <Text className="font-nunito-semibold text-xs text-[#555968]">
          {duration}
        </Text>

        <View className="h-7 w-7 items-center justify-center rounded-full bg-white">
          <Ionicons name="arrow-forward" size={14} color={iconColor} />
        </View>
      </View>
    </View>
  );
}
