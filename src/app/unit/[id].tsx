import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useMemo, useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { type UnitActivity, useUnit } from "@/hooks/useUnit";
import { apiFetch } from "@/lib/api";

function ProgressBar({ value }: { value: number }) {
  return (
    <View className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
      <View
        className="h-full rounded-full bg-primary"
        style={{
          width: `${Math.min(Math.max(value, 0), 100)}%`,
        }}
      />
    </View>
  );
}

export default function UnitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const unitId = Array.isArray(id) ? id[0] : id;

  const { data, isLoading, isError } = useUnit(unitId);

  const queryClient = useQueryClient();

  const unit = data?.unit;

  const activities = useMemo(() => {
    if (!unit) {
      return [];
    }

    return unit.sections
      .sort((a, b) => a.order - b.order)
      .flatMap((section) =>
        section.activities
          .sort((a, b) => a.order - b.order)
          .map((activity) => ({
            ...activity,
            sectionTitle: section.title,
            sectionType: section.type,
          })),
      );
  }, [unit]);

  const firstIncompleteIndex = useMemo(() => {
    const index = activities.findIndex(
      (activity) => !activity.progress?.completed,
    );

    return index === -1 ? activities.length : index;
  }, [activities]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [sentenceWords, setSentenceWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
    xpEarned: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCurrentIndex(firstIncompleteIndex);
  }, [firstIncompleteIndex]);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  useEffect(() => {
    setSelectedAnswer(null);
    setTextAnswer("");
    setSentenceWords([]);
    setFeedback(null);
    Speech.stop();
  }, [currentIndex]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8F7FC]">
        <Text className="font-nunito-semibold text-base text-[#555968]">
          Loading your lesson...
        </Text>
      </View>
    );
  }

  if (isError || !unit) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8F7FC] px-5">
        <Text className="font-fredoka-semibold text-xl text-[#161A2A]">
          Unable to load this unit
        </Text>

        <TouchableOpacity
          className="mt-5 rounded-xl bg-primary px-6 py-3"
          onPress={() => router.back()}
        >
          <Text className="font-nunito-bold text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (currentIndex >= activities.length) {
    return (
      <View className="flex-1 bg-[#F8F7FC]">
        <View className="flex-1 items-center justify-center px-6">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-green">
            <Ionicons name="checkmark" size={40} color="white" />
          </View>

          <Text className="mt-6 text-center font-fredoka-semibold text-3xl text-[#161A2A]">
            Unit Complete!
          </Text>

          <Text className="mt-3 text-center font-nunito text-base leading-6 text-[#777B87]">
            You've completed {unit.title}.
          </Text>

          <TouchableOpacity
            className="mt-8 h-14 w-full flex-row items-center justify-center rounded-xl bg-primary"
            onPress={() => {
              queryClient.invalidateQueries({
                queryKey: ["learning-path"],
              });

              queryClient.invalidateQueries({
                queryKey: ["current-user"],
              });

              router.replace("/learn");
            }}
          >
            <Text className="font-nunito-bold text-base text-white">
              Back to Learning Path
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const activity = activities[currentIndex] as UnitActivity & {
    sectionTitle: string;
    sectionType: string;
  };

  const content = activity.content;

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

  const canSubmit =
    activity.type === "INFO" ||
    selectedAnswer !== null ||
    textAnswer.trim().length > 0 ||
    sentenceWords.length > 0;

  const submitActivity = async () => {
    if (isSubmitting || feedback) {
      return;
    }

    let response: unknown = undefined;

    if (activity.type === "MULTIPLE_CHOICE") {
      response = selectedAnswer;
    }

    if (activity.type === "FILL_BLANK" || activity.type === "CONJUGATION") {
      response = textAnswer.trim();
    }

    if (
      activity.type === "SENTENCE_BUILDER" ||
      activity.type === "WORD_ORDER"
    ) {
      response = sentenceWords;
    }

    if (activity.type === "LISTENING_CHOICE") {
      response = selectedAnswer;
    }

    try {
      setIsSubmitting(true);

      const data = await apiFetch(`/api/activities/${activity.id}/attempt`, {
        method: "POST",
        body: JSON.stringify({
          response,
        }),
      });

      const result = data.result;

      setFeedback({
        isCorrect: result.isCorrect,
        message: result.isCorrect
          ? "Correct! Great work."
          : "Not quite. Try again.",
        xpEarned: result.xpEarned,
      });

      queryClient.invalidateQueries({
        queryKey: ["unit", unitId],
      });

      queryClient.invalidateQueries({
        queryKey: ["learning-path"],
      });

      queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });
    } catch (error) {
      console.error("Failed to submit activity:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectSentenceWord = (word: string) => {
    setSentenceWords((current) => [...current, word]);
  };

  const removeSentenceWord = (index: number) => {
    setSentenceWords((current) =>
      current.filter((_, wordIndex) => wordIndex !== index),
    );
  };

  return (
    <View className="flex-1 bg-[#F8F7FC]">
      {/* Header */}
      <View className="bg-white px-5 pb-5 pt-14">
        <View className="flex-row items-center">
          <TouchableOpacity
            className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-gray-100"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={21} color="#161A2A" />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="font-nunito-semibold text-xs uppercase tracking-wide text-primary">
              {activity.sectionTitle}
            </Text>

            <Text className="mt-1 font-fredoka-semibold text-lg text-[#161A2A]">
              {unit.title}
            </Text>
          </View>

          <Text className="font-nunito-bold text-sm text-[#777B87]">
            {currentIndex + 1}/{activities.length}
          </Text>
        </View>

        <View className="mt-4 flex-row items-center">
          <ProgressBar value={((currentIndex + 1) / activities.length) * 100} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
      >
        {/* Activity title */}
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

        {/* INFO */}
        {activity.type === "INFO" && (
          <View className="mt-6 rounded-2xl border border-gray-100 bg-white p-5">
            <Text className="font-nunito text-base leading-7 text-[#555968]">
              {typeof content.body === "string"
                ? content.body
                : activity.explanation}
            </Text>

            {typeof content.rule === "string" && (
              <View className="mt-5 rounded-xl bg-purple-50 p-4">
                <Text className="font-nunito-bold text-sm text-primary">
                  Remember
                </Text>

                <Text className="mt-1 font-nunito text-sm leading-5 text-[#555968]">
                  {content.rule}
                </Text>
              </View>
            )}

            {typeof content.example === "object" &&
              content.example !== null &&
              !Array.isArray(content.example) && (
                <View className="mt-5 rounded-xl bg-gray-50 p-4">
                  <Text className="font-fredoka-semibold text-lg text-[#161A2A]">
                    {
                      (
                        content.example as {
                          german?: string;
                        }
                      ).german
                    }
                  </Text>

                  <Text className="mt-1 font-nunito text-sm text-[#777B87]">
                    {
                      (
                        content.example as {
                          english?: string;
                        }
                      ).english
                    }
                  </Text>
                </View>
              )}
          </View>
        )}

        {/* MULTIPLE CHOICE */}
        {activity.type === "MULTIPLE_CHOICE" && (
          <View className="mt-6 gap-3">
            {options.map((option) => {
              const selected = selectedAnswer === option;

              return (
                <TouchableOpacity
                  key={option}
                  className={`rounded-2xl border p-4 ${
                    selected
                      ? "border-primary bg-purple-50"
                      : "border-gray-200 bg-white"
                  }`}
                  onPress={() => {
                    setSelectedAnswer(option);
                  }}
                >
                  <Text
                    className={`font-nunito-semibold text-base ${
                      selected ? "text-primary" : "text-[#161A2A]"
                    }`}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* FILL BLANK / CONJUGATION */}
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

            {Array.isArray(content.wordBank) && (
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

        {/* SENTENCE BUILDER */}
        {(activity.type === "SENTENCE_BUILDER" ||
          activity.type === "WORD_ORDER") && (
          <View className="mt-6">
            <View className="min-h-24 flex-row flex-wrap gap-2 rounded-2xl border border-dashed border-gray-300 bg-white p-4">
              {sentenceWords.length === 0 && (
                <Text className="font-nunito text-sm text-[#9CA3AF]">
                  Tap words below to build the sentence
                </Text>
              )}

              {sentenceWords.map((word, index) => (
                <TouchableOpacity
                  key={`${word}-${index}`}
                  className="rounded-lg bg-primary px-3 py-2"
                  onPress={() => removeSentenceWord(index)}
                >
                  <Text className="font-nunito-semibold text-white">
                    {word}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="mt-4 flex-row flex-wrap gap-2">
              {wordBank.map((word, index) => {
                const usedIndex = sentenceWords.findIndex(
                  (item, itemIndex) =>
                    item === word &&
                    !sentenceWords.slice(0, itemIndex).includes(word),
                );

                const isUsed = usedIndex !== -1;

                return (
                  <TouchableOpacity
                    key={`${word}-${index}`}
                    disabled={isUsed}
                    className={`rounded-lg border px-3 py-2 ${
                      isUsed
                        ? "border-gray-200 bg-gray-100"
                        : "border-gray-200 bg-white"
                    }`}
                    onPress={() => selectSentenceWord(word)}
                  >
                    <Text
                      className={`font-nunito-semibold ${
                        isUsed ? "text-[#9CA3AF]" : "text-[#161A2A]"
                      }`}
                    >
                      {word}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* LISTENING */}
        {activity.type === "LISTENING_CHOICE" && (
          <View className="mt-6">
            <TouchableOpacity
              className="h-16 flex-row items-center justify-center rounded-2xl bg-primary"
              onPress={() => {
                if (audioText) {
                  Speech.speak(audioText, {
                    language: "de-DE",
                  });
                }
              }}
            >
              <Ionicons name="volume-high" size={23} color="white" />

              <Text className="ml-2 font-nunito-bold text-base text-white">
                Play Audio
              </Text>
            </TouchableOpacity>

            <View className="mt-5 gap-3">
              {options.map((option) => {
                const selected = selectedAnswer === option;

                return (
                  <TouchableOpacity
                    key={option}
                    className={`rounded-2xl border p-4 ${
                      selected
                        ? "border-primary bg-purple-50"
                        : "border-gray-200 bg-white"
                    }`}
                    onPress={() => setSelectedAnswer(option)}
                  >
                    <Text className="font-nunito-semibold text-base text-[#161A2A]">
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Explanation after answer */}
        {feedback && activity.explanation && (
          <View className="mt-5 rounded-2xl bg-purple-50 p-4">
            <Text className="font-nunito-bold text-sm text-primary">
              Explanation
            </Text>

            <Text className="mt-1 font-nunito text-sm leading-5 text-[#555968]">
              {activity.explanation}
            </Text>
          </View>
        )}

        {/* Feedback */}
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
          </View>
        )}

        {/* Action */}
        <TouchableOpacity
          disabled={!canSubmit || isSubmitting}
          className={`mt-8 h-14 flex-row items-center justify-center rounded-xl ${
            !canSubmit || isSubmitting
              ? "bg-gray-300"
              : feedback?.isCorrect === false
                ? "bg-primary"
                : "bg-primary"
          }`}
          onPress={async () => {
            if (feedback?.isCorrect) {
              setCurrentIndex((index) => index + 1);
              return;
            }

            if (feedback?.isCorrect === false) {
              setFeedback(null);
              return;
            }

            await submitActivity();
          }}
        >
          <Text className="font-nunito-bold text-base text-white">
            {feedback?.isCorrect
              ? currentIndex === activities.length - 1
                ? "Finish Unit"
                : "Continue"
              : feedback?.isCorrect === false
                ? "Try Again"
                : activity.type === "INFO"
                  ? "Continue"
                  : "Check Answer"}
          </Text>

          <Ionicons
            name={feedback?.isCorrect === false ? "refresh" : "arrow-forward"}
            size={20}
            color="white"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
