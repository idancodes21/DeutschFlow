import { Text, View } from "react-native";

export default function ProgressCard() {
  return (
    <View className="mt-7 px-5">
      <Text className="font-fredoka-semibold text-lg text-[#161A2A]">
        Your Progress
      </Text>

      <View className="mt-3 rounded-2xl border border-gray-100 bg-white p-4">
        <View className="flex-row justify-between">
          <Text className="font-nunito-semibold text-sm text-green">
            A1 Beginner
          </Text>

          <Text className="font-nunito text-sm text-[#777B87]">
            A2 Elementary
          </Text>
        </View>

        {/* Progress */}
        <View className="mt-5 h-2 rounded-full bg-gray-200">
          <View className="h-2 w-[30%] rounded-full bg-green" />
        </View>

        <View className="mt-3 flex-row justify-between">
          <Text className="font-nunito-semibold text-sm text-[#555968]">
            4 / 30 lessons completed
          </Text>

          <Text className="font-nunito-bold text-sm text-green">13%</Text>
        </View>
      </View>
    </View>
  );
}
