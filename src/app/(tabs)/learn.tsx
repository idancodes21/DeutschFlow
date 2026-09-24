import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  type LearningPathUnit,
  useLearningPath,
} from "@/hooks/useLearningPath";

function AnimatedEntrance({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 350,
      delay: index * 80,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.timing(translateY, {
      toValue: 0,
      duration: 350,
      delay: index * 80,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

function AnimatedProgressBar({ progress }: { progress: number }) {
  const width = useRef(new Animated.Value(0)).current;
  const clamped = Math.min(Math.max(progress, 0), 100);

  useEffect(() => {
    Animated.timing(width, {
      toValue: clamped,
      duration: 700,
      delay: 150,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [clamped]);

  return (
    <View className="h-2 overflow-hidden rounded-full bg-gray-200">
      <Animated.View
        className="h-full rounded-full bg-primary"
        style={{
          width: width.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"],
          }),
        }}
      />
    </View>
  );
}

function PulsingBadge({
  label,
  bg,
  textColor,
}: {
  label: string;
  bg: string;
  textColor: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.06,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => loop.stop();
  }, [scale]);

  return (
    <Animated.View
      className={`rounded-full ${bg} px-3 py-1`}
      style={{ transform: [{ scale }] }}
    >
      <Text className={`font-nunito-bold text-xs ${textColor}`}>{label}</Text>
    </Animated.View>
  );
}

function UnitNode({
  unit,
  index,
  isLast,
  onPress,
}: {
  unit: LearningPathUnit;
  index: number;
  isLast: boolean;
  onPress: () => void;
}) {
  const isCompleted = unit.status === "completed";
  const isCurrent = unit.status === "current";
  const isLocked = unit.status === "locked";

  return (
    <AnimatedEntrance index={index}>
      <View className="flex-row">
        {/* Timeline */}
        <View className="mr-4 w-12 items-center">
          <View
            className={`h-12 w-12 items-center justify-center rounded-full ${
              isCompleted
                ? "bg-green"
                : isCurrent
                  ? "bg-primary"
                  : "bg-gray-200"
            }`}
          >
            <Ionicons
              name={
                isCompleted ? "checkmark" : isLocked ? "lock-closed" : "book"
              }
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

        {/* Unit card */}
        <TouchableOpacity
          disabled={isLocked}
          activeOpacity={0.8}
          onPress={onPress}
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
                Unit {unit.order}
              </Text>

              <Text
                className={`mt-1 font-fredoka-semibold text-lg ${
                  isLocked ? "text-[#9CA3AF]" : "text-[#161A2A]"
                }`}
              >
                {unit.title}
              </Text>
            </View>

            {isCurrent && (
              <PulsingBadge
                label="CURRENT"
                bg="bg-purple-100"
                textColor="text-primary"
              />
            )}

            {isCompleted && (
              <View className="rounded-full bg-green/10 px-3 py-1">
                <Text className="font-nunito-bold text-xs text-green">
                  DONE
                </Text>
              </View>
            )}
          </View>

          {unit.description && (
            <Text
              className={`mt-2 font-nunito text-sm leading-5 ${
                isLocked ? "text-[#9CA3AF]" : "text-[#777B87]"
              }`}
            >
              {unit.description}
            </Text>
          )}

          {isCurrent && (
            <View className="mt-4">
              <AnimatedProgressBar progress={unit.progress} />

              <Text className="mt-2 font-nunito-semibold text-xs text-primary">
                {unit.progress}% complete
              </Text>
            </View>
          )}

          {isLocked && (
            <View className="mt-3 flex-row items-center">
              <Ionicons name="lock-closed-outline" size={15} color="#9CA3AF" />

              <Text className="ml-1 font-nunito-semibold text-xs text-[#9CA3AF]">
                Complete the previous unit first
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </AnimatedEntrance>
  );
}

function PathHeader({ description }: { description: string }) {
  return (
    <AnimatedEntrance index={0}>
      <View className="px-5 pb-6 pt-14">
        <Text className="font-fredoka-semibold text-3xl text-[#161A2A]">
          Your Learning Path
        </Text>

        <Text className="mt-2 font-nunito text-base leading-6 text-[#777B87]">
          {description}
        </Text>
      </View>
    </AnimatedEntrance>
  );
}

export default function LearnScreen() {
  const { data, isLoading, isError } = useLearningPath();

  const path = data?.path;
  const units = path?.units ?? [];

  return (
    <View className="flex-1 bg-[#F8F7FC]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <PathHeader
          description={
            path?.description ?? "Build your German skills step by step."
          }
        />

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

        {!isLoading && !isError && path && (
          <View className="px-5">
            <View className="mb-5 flex-row items-center justify-between">
              <View>
                <Text className="font-fredoka-semibold text-xl text-[#161A2A]">
                  {path.name}
                </Text>

                <Text className="mt-1 font-nunito text-sm text-[#777B87]">
                  {units.length} units
                </Text>
              </View>

              <View className="rounded-full bg-purple-100 px-3 py-2">
                <Text className="font-nunito-bold text-xs text-primary">
                  {units[0]?.cefrLevel ?? "A1"}
                </Text>
              </View>
            </View>

            {units.map((unit, index) => (
              <UnitNode
                key={unit.id}
                unit={unit}
                index={index}
                isLast={index === units.length - 1}
                onPress={() => {
                  if (!unit.locked) {
                    router.push({
                      pathname: "/unit/[id]",
                      params: {
                        id: unit.id,
                      },
                    });
                  }
                }}
              />
            ))}
          </View>
        )}

        {!isLoading && !isError && (!path || units.length === 0) && (
          <View className="px-5">
            <View className="rounded-2xl bg-white p-5">
              <Text className="font-fredoka-semibold text-lg text-[#161A2A]">
                Your path is being prepared
              </Text>

              <Text className="mt-2 font-nunito text-sm leading-5 text-[#777B87]">
                Your lessons will appear here soon.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
