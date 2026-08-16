import { Text, View } from "react-native";
import FocusCard from "./FocusCard";

export default function TodaysFocus() {
  return (
    <View className="mt-7 px-5">
      {/* Heading */}
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="font-fredoka-semibold text-lg text-[#161A2A]">
          Today's Focus
        </Text>

        <Text className="font-nunito-semibold text-sm text-primary">
          See all
        </Text>
      </View>

      {/* Cards */}
      <View className="flex-row gap-3">
        <FocusCard
          title="Vocabulary"
          description="Review words you've learned"
          duration="10 words"
          icon="book"
          backgroundColor="bg-green-light"
          iconBackground="bg-green"
          iconColor="#299477"
        />

        <FocusCard
          title="Listening"
          description="Train your ear with real audio"
          duration="5 min"
          icon="headset"
          backgroundColor="bg-yellow-light"
          iconBackground="bg-yellow"
          iconColor="#D99A00"
        />

        <FocusCard
          title="Speaking"
          description="Practice today's phrases out loud"
          duration="5 min"
          icon="mic"
          backgroundColor="bg-purple-100"
          iconBackground="bg-purple-500"
          iconColor="#6554C0"
        />
      </View>
    </View>
  );
}
