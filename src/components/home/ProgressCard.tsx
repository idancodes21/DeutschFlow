import { Text, View } from "react-native";

import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function ProgressCard() {
  const { data, isLoading } = useCurrentUser();

  const progress = data?.user.learningProgress;

  const level = progress?.level ?? 1;
  const lessonsCompleted = progress?.lessonsCompleted ?? 0;
  const totalLessons = 30;

  const progressPercentage =
    totalLessons > 0
      ? Math.min((lessonsCompleted / totalLessons) * 100, 100)
      : 0;

  const formattedPercentage = Math.round(progressPercentage);

  const levelName =
    level === 1
      ? "A1 Beginner"
      : level === 2
        ? "A2 Elementary"
        : `Level ${level}`;

  return (
    <View className="mt-7 px-5">
      <Text className="font-fredoka-semibold text-lg text-[#161A2A]">
        Your Progress
      </Text>

      <View className="mt-3 rounded-2xl border border-gray-100 bg-white p-4">
        <View className="flex-row justify-between">
          <Text className="font-nunito-semibold text-sm text-green">
            {isLoading ? "Loading..." : levelName}
          </Text>

          <Text className="font-nunito text-sm text-[#777B87]">
            A2 Elementary
          </Text>
        </View>

        <View className="mt-5 h-2 overflow-hidden rounded-full bg-gray-200">
          <View
            className="h-2 rounded-full bg-green"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </View>

        <View className="mt-3 flex-row justify-between">
          <Text className="font-nunito-semibold text-sm text-[#555968]">
            {isLoading
              ? "Loading..."
              : `${lessonsCompleted} / ${totalLessons} lessons completed`}
          </Text>

          <Text className="font-nunito-bold text-sm text-green">
            {isLoading ? "..." : `${formattedPercentage}%`}
          </Text>
        </View>
      </View>
    </View>
  );
}
