import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { type PracticeMode, usePracticeSession } from "@/hooks/usePractice";
import { apiFetch } from "@/lib/api";

export default function PracticeSessionScreen() {
  const params = useLocalSearchParams<{ mode?: string }>();

  const mode: PracticeMode = params.mode === "mistakes" ? "mistakes" : "review";

  const { data, isLoading, isError } = usePracticeSession(mode);
  const queryClient = useQueryClient();

  const activities = data?.activities ?? [];
  const [index, setIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [sentenceWords, setSentenceWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
    xpEarned: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activity = activities[index];
  const content = activity?.content ?? {};

  const options = Array.isArray(content.options)
    ? content.options.filter((item): item is string => typeof item === "string")
    : [];

  const wordBank = Array.isArray(content.wordBank)
    ? content.wordBank.filter(
        (item): item is string => typeof item === "string",
      )
    : [];

  const audioText =
    typeof content.audioText === "string" ? content.audioText : null;

  useEffect(() => {
    setSelectedAnswer(null);
    setTextAnswer("");
    setSentenceWords([]);
    setFeedback(null);
    Speech.stop();
  }, [index, activity?.id]);

  useEffect(() => {
    return () => {
      void Speech.stop();
    };
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8F7FC]">
        <ActivityIndicator size="large" color="#6554C0" />
        <Text className="mt-3 font-nunito text-sm text-[#777B87]">
          Preparing your review...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8F7FC] px-5">
        <Text className="font-fredoka-semibold text-xl text-[#161A2A]">
          Couldn't load this practice session
        </Text>
        <TouchableOpacity
          className="mt-5 rounded-xl bg-primary px-5 py-3"
          onPress={() => router.back()}
        >
          <Text className="font-nunito-bold text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!activity) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8F7FC] px-6">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-purple-100">
          <Ionicons name="checkmark-done" size={40} color="#6554C0" />
        </View>

        <Text className="mt-6 text-center font-fredoka-semibold text-2xl text-[#161A2A]">
          {index === 0 ? "Nothing to review yet" : "Review complete!"}
        </Text>

        <Text className="mt-3 text-center font-nunito text-base leading-6 text-[#777B87]">
          {index === 0
            ? "Complete some lessons or practice exercises first. Your review activities will appear here."
            : "Good work. Keep revisiting what you have learned to strengthen your recall."}
        </Text>

        <TouchableOpacity
          className="mt-7 h-12 w-full items-center justify-center rounded-xl bg-primary"
          onPress={() => {
            queryClient.invalidateQueries({
              queryKey: ["practice-overview"],
            });
            router.back();
          }}
        >
          <Text className="font-nunito-bold text-white">Back to Practice</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const canSubmit =
    selectedAnswer !== null ||
    textAnswer.trim().length > 0 ||
    sentenceWords.length > 0;

  const submitAnswer = async () => {
    if (isSubmitting || feedback) return;

    let response: unknown;

    if (
      activity.type === "MULTIPLE_CHOICE" ||
      activity.type === "LISTENING_CHOICE"
    ) {
      response = selectedAnswer;
    } else if (
      activity.type === "FILL_BLANK" ||
      activity.type === "CONJUGATION"
    ) {
      response = textAnswer.trim();
    } else if (
      activity.type === "SENTENCE_BUILDER" ||
      activity.type === "WORD_ORDER"
    ) {
      response = sentenceWords;
    } else {
      return;
    }

    try {
      setIsSubmitting(true);

      const data = await apiFetch(`/api/activities/${activity.id}/attempt`, {
        method: "POST",
        body: JSON.stringify({ response }),
      });

      setFeedback({
        isCorrect: data.result.isCorrect,
        message: data.result.isCorrect
          ? "Correct! Nicely done."
          : "Not quite. Give it another try.",
        xpEarned: data.result.xpEarned,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["practice-overview"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["current-user"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["learning-path"],
        }),
      ]);
    } catch (error) {
      console.error("Failed to submit practice answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F8F7FC]">
      <View className="bg-white px-5 pb-5 pt-14">
        <View className="flex-row items-center">
          <TouchableOpacity
            className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-100"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={21} color="#161A2A" />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="font-nunito-semibold text-xs uppercase tracking-wide text-primary">
              {mode === "mistakes" ? "Review Mistakes" : "Quick Review"}
            </Text>
            <Text className="mt-1 font-fredoka-semibold text-lg text-[#161A2A]">
              {activity.unitTitle}
            </Text>
          </View>

          <Text className="font-nunito-bold text-sm text-[#777B87]">
            {index + 1}/{activities.length}
          </Text>
        </View>

        <View className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
          <View
            className="h-full rounded-full bg-primary"
            style={{
              width: `${((index + 1) / activities.length) * 100}%`,
            }}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {activity.title && (
          <Text className="font-fredoka-semibold text-2xl text-[#161A2A]">
            {activity.title}
          </Text>
        )}

        {activity.prompt && (
          <Text className="mt-3 font-nunito text-base leading-6 text-[#555968]">
            {activity.prompt}
          </Text>
        )}

        {(activity.type === "MULTIPLE_CHOICE" ||
          activity.type === "LISTENING_CHOICE") && (
          <View className="mt-6 gap-3">
            {activity.type === "LISTENING_CHOICE" && (
              <TouchableOpacity
                className="mb-2 h-14 flex-row items-center justify-center rounded-xl bg-primary"
                onPress={() => {
                  if (audioText) {
                    Speech.speak(audioText, { language: "de-DE" });
                  }
                }}
              >
                <Ionicons name="volume-high" size={22} color="white" />
                <Text className="ml-2 font-nunito-bold text-white">
                  Play Audio
                </Text>
              </TouchableOpacity>
            )}

            {options.map((option) => {
              const selected = selectedAnswer === option;

              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => setSelectedAnswer(option)}
                  className={`rounded-2xl border p-4 ${
                    selected
                      ? "border-primary bg-purple-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <Text className="font-nunito-semibold text-base text-[#161A2A]">
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {(activity.type === "FILL_BLANK" ||
          activity.type === "CONJUGATION") && (
          <View className="mt-6">
            <TextInput
              value={textAnswer}
              onChangeText={setTextAnswer}
              placeholder="Type your answer..."
              autoCapitalize="none"
              className="rounded-2xl border border-gray-200 bg-white px-4 py-4 font-nunito text-base text-[#161A2A]"
            />

            {wordBank.length > 0 && (
              <View className="mt-4 flex-row flex-wrap gap-2">
                {wordBank.map((word) => (
                  <TouchableOpacity
                    key={word}
                    className="rounded-full bg-purple-100 px-4 py-2"
                    onPress={() => setTextAnswer(word)}
                  >
                    <Text className="font-nunito-semibold text-sm text-primary">
                      {word}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {(activity.type === "SENTENCE_BUILDER" ||
          activity.type === "WORD_ORDER") && (
          <View className="mt-6">
            <View className="min-h-24 flex-row flex-wrap gap-2 rounded-2xl border border-dashed border-gray-300 bg-white p-4">
              {sentenceWords.length === 0 && (
                <Text className="font-nunito text-sm text-[#9CA3AF]">
                  Tap words below to build the sentence
                </Text>
              )}

              {sentenceWords.map((word, wordIndex) => (
                <TouchableOpacity
                  key={`${word}-${wordIndex}`}
                  className="rounded-lg bg-primary px-3 py-2"
                  onPress={() =>
                    setSentenceWords((current) =>
                      current.filter((_, i) => i !== wordIndex),
                    )
                  }
                >
                  <Text className="font-nunito-semibold text-white">
                    {word}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="mt-4 flex-row flex-wrap gap-2">
              {wordBank.map((word, wordIndex) => (
                <TouchableOpacity
                  key={`${word}-${wordIndex}`}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2"
                  onPress={() =>
                    setSentenceWords((current) => [...current, word])
                  }
                >
                  <Text className="font-nunito-semibold text-[#161A2A]">
                    {word}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {feedback && (
          <View
            className={`mt-5 rounded-2xl p-4 ${
              feedback.isCorrect ? "bg-green/10" : "bg-red-50"
            }`}
          >
            <Text
              className={`font-fredoka-semibold text-lg ${
                feedback.isCorrect ? "text-green" : "text-red-500"
              }`}
            >
              {feedback.message}
            </Text>

            {feedback.xpEarned > 0 && (
              <Text className="mt-1 font-nunito-bold text-sm text-primary">
                +{feedback.xpEarned} XP
              </Text>
            )}

            {activity.explanation && (
              <Text className="mt-2 font-nunito text-sm leading-5 text-[#555968]">
                {activity.explanation}
              </Text>
            )}
          </View>
        )}

        <TouchableOpacity
          disabled={isSubmitting || (!feedback && !canSubmit)}
          className="mt-8 h-14 flex-row items-center justify-center rounded-xl bg-primary"
          onPress={async () => {
            if (feedback?.isCorrect) {
              setIndex((current) => current + 1);
              return;
            }

            if (feedback?.isCorrect === false) {
              setFeedback(null);
              return;
            }

            await submitAnswer();
          }}
        >
          <Text className="font-nunito-bold text-base text-white">
            {isSubmitting
              ? "Checking..."
              : feedback?.isCorrect
                ? "Continue"
                : feedback
                  ? "Try Again"
                  : "Check Answer"}
          </Text>

          {!isSubmitting && (
            <Ionicons
              name="arrow-forward"
              size={20}
              color="white"
              style={{ marginLeft: 8 }}
            />
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
