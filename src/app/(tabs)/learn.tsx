import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import {
    type LearningPathLesson,
    useLearningPath,
} from "@/hooks/useLearningPath";

function LessonNode({
  lesson,
  isLast,
  onPress,
}: {
  lesson: LearningPathLesson;
  isLast: boolean;
  onPress: () => void;
}) {
  const isCompleted = lesson.status === "completed";
  const isCurrent = lesson.status === "current";
  const isLocked = lesson.status === "locked";

  return (
    <View className="flex-row">
      {/* Timeline */}
      <View className="mr-4 w-12 items-center">
        <View
          className={`h-12 w-12 items-center justify-center rounded-full ${
            isCompleted ? "bg-green" : isCurrent ? "bg-primary" : "bg-gray-200"
          }`}
        >
          <Ionicons
            name={isCompleted ? "checkmark" : isLocked ? "lock-closed" : "book"}
            size={22}
            color={isLocked ? "#9CA3AF" : "white"}
          />
        </View>

        {!isLast && (
          <View
            className={`my-2 w-1 flex-1 ${
              isCompleted ? "bg-green" : "bg-gray-200"
            }`}
          />
        )}
      </View>

      {/* Lesson card */}
      <TouchableOpacity
        disabled={isLocked}
        onPress={onPress}
        activeOpacity={0.8}
        className={`mb-5 flex-1 rounded-2xl border p-4 ${
          isCurrent
            ? "border-primary bg-white"
            : isCompleted
              ? "border-green/20 bg-white"
              : "border-gray-100 bg-gray-50"
        }`}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="font-nunito-semibold text-xs uppercase tracking-wide text-[#777B87]">
              Lesson {lesson.order}
            </Text>

            <Text
              className={`mt-1 font-fredoka-semibold text-lg ${
                isLocked ? "text-[#9CA3AF]" : "text-[#161A2A]"
              }`}
            >
              {lesson.title}
            </Text>
          </View>

          {isCurrent && (
            <View className="rounded-full bg-purple-100 px-3 py-1">
              <Text className="font-nunito-bold text-xs text-primary">
                CURRENT
              </Text>
            </View>
          )}

          {isCompleted && (
            <View className="rounded-full bg-green/10 px-3 py-1">
              <Text className="font-nunito-bold text-xs text-green">DONE</Text>
            </View>
          )}
        </View>

        {lesson.description && (
          <Text
            className={`mt-2 font-nunito text-sm leading-5 ${
              isLocked ? "text-[#9CA3AF]" : "text-[#777B87]"
            }`}
          >
            {lesson.description}
          </Text>
        )}

        {isCurrent && (
          <View className="mt-4">
            <View className="h-2 overflow-hidden rounded-full bg-gray-200">
              <View
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${Math.min(Math.max(lesson.progress, 0), 100)}%`,
                }}
              />
            </View>

            <Text className="mt-2 font-nunito-semibold text-xs text-primary">
              {lesson.progress}% complete
            </Text>
          </View>
        )}

        {isLocked && (
          <View className="mt-3 flex-row items-center">
            <Ionicons name="lock-closed-outline" size={15} color="#9CA3AF" />

            <Text className="ml-1 font-nunito-semibold text-xs text-[#9CA3AF]">
              Complete the previous lesson first
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function LearnScreen() {
  const { data, isLoading, isError } = useLearningPath();

  const lessons = data?.path ?? [];

  const levels = Array.from(
    new Set(lessons.map((lesson) => lesson.level)),
  ).sort((a, b) => a - b);

  return (
    <View className="flex-1 bg-[#F8F7FC]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="px-5 pb-6 pt-14">
          <Text className="font-fredoka-semibold text-3xl text-[#161A2A]">
            Your Learning Path
          </Text>

          <Text className="mt-2 font-nunito text-base leading-6 text-[#777B87]">
            Follow the path step by step and build your German skills.
          </Text>
        </View>

        {isLoading && (
          <View className="px-5">
            <View className="rounded-2xl bg-white p-5">
              <Text className="font-nunito text-sm text-[#777B87]">
                Loading your learning path...
              </Text>
            </View>
          </View>
        )}

        {isError && (
          <View className="px-5">
            <View className="rounded-2xl bg-white p-5">
              <Text className="font-fredoka-semibold text-lg text-[#161A2A]">
                Couldn't load your learning path
              </Text>

              <Text className="mt-2 font-nunito text-sm text-[#777B87]">
                Please check your connection and try again.
              </Text>
            </View>
          </View>
        )}

        {!isLoading &&
          !isError &&
          levels.map((level) => {
            const levelLessons = lessons.filter(
              (lesson) => lesson.level === level,
            );

            const levelName =
              level === 1
                ? "A1 Beginner"
                : level === 2
                  ? "A2 Elementary"
                  : `Level ${level}`;

            const completedCount = levelLessons.filter(
              (lesson) => lesson.completed,
            ).length;

            return (
              <View key={level} className="px-5">
                <View className="mb-4 mt-2 flex-row items-center justify-between">
                  <View>
                    <Text className="font-fredoka-semibold text-xl text-[#161A2A]">
                      {levelName}
                    </Text>

                    <Text className="mt-1 font-nunito text-sm text-[#777B87]">
                      {completedCount} of {levelLessons.length} lessons
                      completed
                    </Text>
                  </View>

                  <View className="rounded-full bg-purple-100 px-3 py-2">
                    <Text className="font-nunito-bold text-xs text-primary">
                      A{level}
                    </Text>
                  </View>
                </View>

                {levelLessons.map((lesson, index) => (
                  <LessonNode
                    key={lesson.id}
                    lesson={lesson}
                    isLast={index === levelLessons.length - 1}
                    onPress={() => {
                      // Actual lesson activity navigation will be added next.
                    }}
                  />
                ))}
              </View>
            );
          })}

        {!isLoading && !isError && lessons.length === 0 && (
          <View className="px-5">
            <View className="rounded-2xl bg-white p-5">
              <Text className="font-fredoka-semibold text-lg text-[#161A2A]">
                Your path is being prepared
              </Text>

              <Text className="mt-2 font-nunito text-sm leading-5 text-[#777B87]">
                Lessons will appear here once they are published.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
