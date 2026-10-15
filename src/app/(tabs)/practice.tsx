import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { usePracticeOverview } from "@/hooks/usePractice";

function PracticeCard({
  icon,
  title,
  description,
  count,
  action,
  disabled = false,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  count: number;
  action: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.8}
      onPress={onPress}
      className={`mb-4 rounded-2xl border border-gray-100 bg-white p-5 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <View className="flex-row items-start">
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
          <Ionicons name={icon} size={25} color="#6554C0" />
        </View>

        <View className="ml-4 flex-1">
          <Text className="font-fredoka-semibold text-lg text-[#161A2A]">
            {title}
          </Text>

          <Text className="mt-1 font-nunito text-sm leading-5 text-[#777B87]">
            {description}
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row items-center justify-between">
        <Text className="font-nunito-semibold text-sm text-primary">
          {count} {count === 1 ? "activity" : "activities"} available
        </Text>

        <View className="flex-row items-center">
          <Text className="font-nunito-bold text-sm text-primary">
            {action}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={17}
            color="#6554C0"
            style={{ marginLeft: 6 }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function PracticeScreen() {
  const { data, isLoading, isError, refetch } = usePracticeOverview();

  const overview = data?.overview;

  return (
    <View className="flex-1 bg-[#F8F7FC]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-5 pb-5 pt-14">
          <Text className="font-fredoka-semibold text-3xl text-[#161A2A]">
            Practice
          </Text>

          <Text className="mt-2 font-nunito text-base leading-6 text-[#777B87]">
            Strengthen what you have learned. Recall, repeat, and build
            confidence one pattern at a time.
          </Text>
        </View>

        {isLoading && (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#6554C0" />
            <Text className="mt-3 font-nunito text-sm text-[#777B87]">
              Preparing your practice...
            </Text>
          </View>
        )}

        {isError && (
          <View className="mx-5 rounded-2xl border border-gray-100 bg-white p-5">
            <Text className="font-fredoka-semibold text-lg text-[#161A2A]">
              Couldn't load practice
            </Text>

            <Text className="mt-2 font-nunito text-sm text-[#777B87]">
              Check your connection and try again.
            </Text>

            <TouchableOpacity
              className="mt-4 self-start rounded-xl bg-primary px-5 py-3"
              onPress={() => refetch()}
            >
              <Text className="font-nunito-bold text-white">Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {overview && (
          <>
            <View className="mx-5 mb-6 overflow-hidden rounded-[22px] bg-primary p-5">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="font-nunito-semibold text-xs uppercase tracking-widest text-purple-100">
                    Your practice space
                  </Text>

                  <Text className="mt-2 font-fredoka-semibold text-2xl text-white">
                    Small steps. Stronger German.
                  </Text>

                  <Text className="mt-2 font-nunito text-sm leading-5 text-purple-100">
                    Review familiar patterns before moving on to new ones.
                  </Text>
                </View>

                <Ionicons name="fitness" size={43} color="#FFFFFF" />
              </View>
            </View>

            <View className="mx-5 mb-6 flex-row gap-3">
              <View className="flex-1 rounded-2xl border border-gray-100 bg-white p-4">
                <Ionicons
                  name="checkmark-circle-outline"
                  size={22}
                  color="#6554C0"
                />

                <Text className="mt-3 font-fredoka-semibold text-2xl text-[#161A2A]">
                  {overview.completedActivities}
                </Text>

                <Text className="mt-1 font-nunito text-xs text-[#777B87]">
                  Exercises learned
                </Text>
              </View>

              <View className="flex-1 rounded-2xl border border-gray-100 bg-white p-4">
                <Ionicons
                  name="refresh-circle-outline"
                  size={22}
                  color="#6554C0"
                />

                <Text className="mt-3 font-fredoka-semibold text-2xl text-[#161A2A]">
                  {overview.mistakeCount}
                </Text>

                <Text className="mt-1 font-nunito text-xs text-[#777B87]">
                  Exercises to revisit
                </Text>
              </View>
            </View>

            <View className="px-5">
              <Text className="mb-3 font-fredoka-semibold text-xl text-[#161A2A]">
                Choose your practice
              </Text>

              <PracticeCard
                icon="repeat"
                title="Quick Review"
                description="Revisit exercises you have already completed and strengthen your recall."
                count={overview.completedActivities}
                action="Start review"
                disabled={overview.completedActivities === 0}
                onPress={() =>
                  router.push({
                    pathname: "/practice/session",
                    params: { mode: "review" },
                  })
                }
              />

              <PracticeCard
                icon="refresh-circle"
                title="Review Mistakes"
                description="Try exercises you previously answered incorrectly. Learn from the correction."
                count={overview.mistakeCount}
                action="Try again"
                disabled={overview.mistakeCount === 0}
                onPress={() =>
                  router.push({
                    pathname: "/practice/session",
                    params: { mode: "mistakes" },
                  })
                }
              />

              <View className="mt-1 rounded-2xl border border-gray-100 bg-white p-5">
                <View className="flex-row items-center">
                  <View className="h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
                    <Ionicons name="book-outline" size={23} color="#6554C0" />
                  </View>

                  <View className="ml-3 flex-1">
                    <Text className="font-fredoka-semibold text-lg text-[#161A2A]">
                      Vocabulary review
                    </Text>

                    <Text className="mt-1 font-nunito text-sm leading-5 text-[#777B87]">
                      {overview.dueVocabularyCount > 0
                        ? `${overview.dueVocabularyCount} words are due for review.`
                        : "Spaced vocabulary review will become available as you build your word history."}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="mx-5 mt-6 rounded-2xl bg-purple-50 p-5">
              <Text className="font-fredoka-semibold text-lg text-[#161A2A]">
                Remember
              </Text>

              <Text className="mt-2 font-nunito text-sm leading-5 text-[#555968]">
                You don't need to rush. Understanding a pattern and recalling it
                confidently matters more than moving through lessons quickly.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
