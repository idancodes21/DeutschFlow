import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  type LayoutChangeEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  type LearningPathUnit,
  useLearningPath,
} from "@/hooks/useLearningPath";

type IconName = ComponentProps<typeof Ionicons>["name"];

const STAGES: { title: string; icon: IconName }[] = [
  { title: "See the pattern", icon: "bulb" },
  { title: "Try the pattern", icon: "extension-puzzle" },
  { title: "Build a sentence", icon: "construct" },
  { title: "Do it from memory", icon: "flash" },
  { title: "Mix it up", icon: "shuffle" },
  { title: "Hear it", icon: "headset" },
];

/** Ping-pong 0 → 1 → 0 loop. */
function useLoop(duration: number, enabled = true) {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!enabled) {
      value.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [value, duration, enabled]);

  return value;
}

/** Repeating 0 → 1 sweep that restarts from 0 each time. */
function useRepeat(duration: number) {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(value, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    );

    loop.start();
    return () => loop.stop();
  }, [value, duration]);

  return value;
}

function AnimatedEntrance({
  index,
  children,
  onLayout,
}: {
  index: number;
  children: ReactNode;
  onLayout?: (event: LayoutChangeEvent) => void;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    const delay = index * 90;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        friction: 8,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      onLayout={onLayout}
      style={{ opacity, transform: [{ translateY }] }}
    >
      {children}
    </Animated.View>
  );
}

function PopIn({
  delay = 0,
  children,
}: {
  delay?: number;
  children: ReactNode;
}) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      delay,
      friction: 5,
      tension: 140,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>
  );
}

function PressableScale({
  children,
  onPress,
  className,
  accessibilityLabel,
}: {
  children: ReactNode;
  onPress: () => void;
  className?: string;
  accessibilityLabel?: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) =>
    Animated.spring(scale, {
      toValue,
      friction: 6,
      tension: 200,
      useNativeDriver: true,
    }).start();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onPressIn={() => animateTo(0.97)}
      onPressOut={() => animateTo(1)}
    >
      <Animated.View className={className} style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

function useShake() {
  const x = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence(
      [10, -10, 8, -8, 4, 0].map((toValue) =>
        Animated.timing(x, {
          toValue,
          duration: 55,
          useNativeDriver: true,
        }),
      ),
    ).start();
  };

  return { x, shake };
}

function CountUp({ value, className }: { value: number; className?: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const id = anim.addListener(({ value: v }) => setDisplay(Math.round(v)));

    Animated.timing(anim, {
      toValue: value,
      duration: 900,
      delay: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => anim.removeListener(id);
  }, [value]);

  return <Text className={className}>{display}%</Text>;
}

function ProgressBar({
  progress,
  shimmer = false,
}: {
  progress: number;
  shimmer?: boolean;
}) {
  const width = useRef(new Animated.Value(0)).current;
  const sweep = useRepeat(1600);
  const clamped = Math.min(Math.max(progress, 0), 100);

  useEffect(() => {
    Animated.timing(width, {
      toValue: clamped,
      duration: 900,
      delay: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [clamped]);

  return (
    <View className="h-2.5 overflow-hidden rounded-full bg-gray-200">
      <Animated.View
        className="h-full overflow-hidden rounded-full bg-primary"
        style={{
          width: width.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"],
          }),
        }}
      >
        {shimmer && (
          <Animated.View
            className="absolute h-full w-8 bg-white/30"
            style={{
              transform: [
                {
                  translateX: sweep.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-32, 320],
                  }),
                },
              ],
            }}
          />
        )}
      </Animated.View>
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
  const pulse = useLoop(700);

  return (
    <Animated.View
      className={`rounded-full ${bg} px-3 py-1`}
      style={{
        transform: [
          {
            scale: pulse.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.07],
            }),
          },
        ],
      }}
    >
      <Text className={`font-nunito-bold text-xs ${textColor}`}>{label}</Text>
    </Animated.View>
  );
}

function PulseRing() {
  const t = useRepeat(1500);

  return (
    <Animated.View
      pointerEvents="none"
      className="absolute left-0 top-0 h-12 w-12 rounded-full border-2 border-primary"
      style={{
        opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }),
        transform: [
          {
            scale: t.interpolate({ inputRange: [0, 1], outputRange: [1, 1.7] }),
          },
        ],
      }}
    />
  );
}

function StageDot({
  icon,
  state,
  delay,
}: {
  icon: IconName;
  state: "done" | "active" | "todo";
  delay: number;
}) {
  const pulse = useLoop(650, state === "active");

  const bg =
    state === "done"
      ? "bg-green"
      : state === "active"
        ? "bg-primary"
        : "bg-gray-200";

  return (
    <PopIn delay={delay}>
      <Animated.View
        className={`h-9 w-9 items-center justify-center rounded-full ${bg}`}
        style={{
          transform: [
            {
              scale: pulse.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.12],
              }),
            },
          ],
        }}
      >
        <Ionicons
          name={state === "done" ? "checkmark" : icon}
          size={16}
          color={state === "todo" ? "#9CA3AF" : "white"}
        />
      </Animated.View>
    </PopIn>
  );
}

function StageTrack({ progress }: { progress: number }) {
  const doneCount = Math.min(
    Math.floor((progress / 100) * STAGES.length),
    STAGES.length,
  );
  const activeIndex = Math.min(doneCount, STAGES.length - 1);

  return (
    <View className="mt-4">
      <View className="flex-row items-center">
        {STAGES.map((stage, i) => {
          const state =
            i < doneCount ? "done" : i === activeIndex ? "active" : "todo";

          return (
            <View
              key={stage.title}
              className={`flex-row items-center ${
                i < STAGES.length - 1 ? "flex-1" : ""
              }`}
            >
              <StageDot icon={stage.icon} state={state} delay={350 + i * 70} />

              {i < STAGES.length - 1 && (
                <View
                  className={`mx-1 h-0.5 flex-1 rounded-full ${
                    i < doneCount ? "bg-green" : "bg-gray-200"
                  }`}
                />
              )}
            </View>
          );
        })}
      </View>

      <Text className="mt-3 font-nunito-semibold text-xs text-primary">
        Up next · {STAGES[activeIndex].title}
      </Text>
    </View>
  );
}

function ContinueButton({ label }: { label: string }) {
  const nudge = useLoop(500);

  return (
    <View className="mt-4 flex-row items-center justify-center rounded-xl bg-primary py-3">
      <Text className="font-nunito-bold text-sm text-white">{label}</Text>

      <Animated.View
        style={{
          marginLeft: 6,
          transform: [
            {
              translateX: nudge.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 4],
              }),
            },
          ],
        }}
      >
        <Ionicons name="arrow-forward" size={16} color="white" />
      </Animated.View>
    </View>
  );
}

function UnitNode({
  unit,
  index,
  isLast,
  onPress,
  onNodeLayout,
}: {
  unit: LearningPathUnit;
  index: number;
  isLast: boolean;
  onPress: () => void;
  onNodeLayout?: (event: LayoutChangeEvent) => void;
}) {
  const isCompleted = unit.status === "completed";
  const isCurrent = unit.status === "current";
  const isLocked = unit.status === "locked";

  const { x, shake } = useShake();
  const bob = useLoop(900, isCurrent);

  const handlePress = () => {
    if (isLocked) {
      shake();
      return;
    }
    onPress();
  };

  const circleBg = isCompleted
    ? "bg-green"
    : isCurrent
      ? "bg-primary"
      : "bg-gray-200";

  const circle = (
    <Animated.View
      className={`h-12 w-12 items-center justify-center rounded-full ${circleBg}`}
      style={{
        transform: [
          {
            translateY: bob.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -3],
            }),
          },
        ],
      }}
    >
      <Ionicons
        name={isCompleted ? "checkmark" : isLocked ? "lock-closed" : "book"}
        size={22}
        color={isLocked ? "#9CA3AF" : "white"}
      />
    </Animated.View>
  );

  return (
    <AnimatedEntrance index={index} onLayout={onNodeLayout}>
      <View className="flex-row">
        {/* Timeline */}
        <View className="mr-4 w-12 items-center">
          <View className="h-12 w-12">
            {isCurrent && <PulseRing />}
            {isCompleted ? (
              <PopIn delay={250 + index * 80}>{circle}</PopIn>
            ) : (
              circle
            )}
          </View>

          {!isLast && (
            <View
              className={`my-2 w-1 flex-1 rounded-full ${
                isCompleted ? "bg-green" : "bg-gray-200"
              }`}
            />
          )}
        </View>

        {/* Unit card */}
        <Animated.View style={{ flex: 1, transform: [{ translateX: x }] }}>
          <PressableScale
            onPress={handlePress}
            accessibilityLabel={`Unit ${unit.order}: ${unit.title}${
              isLocked ? ", locked" : ""
            }`}
            className={`mb-5 rounded-2xl border p-4 ${
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
              <>
                <StageTrack progress={unit.progress} />

                <View className="mt-4">
                  <ProgressBar progress={unit.progress} shimmer />

                  <View className="mt-2 flex-row items-center justify-between">
                    <CountUp
                      value={unit.progress}
                      className="font-nunito-semibold text-xs text-primary"
                    />
                    <Text className="font-nunito-semibold text-xs text-[#777B87]">
                      {STAGES.length} stages
                    </Text>
                  </View>
                </View>

                <ContinueButton
                  label={unit.progress > 0 ? "Continue" : "Start unit"}
                />
              </>
            )}

            {isCompleted && (
              <View className="mt-3 flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                <Text className="ml-1 font-nunito-semibold text-xs text-green">
                  All {STAGES.length} stages complete · tap to review
                </Text>
              </View>
            )}

            {isLocked && (
              <View className="mt-3 flex-row items-center">
                <Ionicons
                  name="lock-closed-outline"
                  size={15}
                  color="#9CA3AF"
                />

                <Text className="ml-1 font-nunito-semibold text-xs text-[#9CA3AF]">
                  Complete the previous unit first
                </Text>
              </View>
            )}
          </PressableScale>
        </Animated.View>
      </View>
    </AnimatedEntrance>
  );
}

function Wave() {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(500),
      ...[1, -1, 1, -1, 0].map((toValue) =>
        Animated.timing(rotation, {
          toValue,
          duration: 160,
          useNativeDriver: true,
        }),
      ),
    ]).start();
  }, []);

  return (
    <Animated.Text
      style={{
        fontSize: 24,
        marginLeft: 6,
        transform: [
          {
            rotate: rotation.interpolate({
              inputRange: [-1, 1],
              outputRange: ["-18deg", "18deg"],
            }),
          },
        ],
      }}
    >
      👋
    </Animated.Text>
  );
}

function PathHeader({ description }: { description: string }) {
  return (
    <AnimatedEntrance index={0}>
      <View className="px-5 pb-6 pt-14">
        <View className="flex-row items-center">
          <Text className="font-fredoka-semibold text-xl text-primary">
            Hallo!
          </Text>
          <Wave />
        </View>

        <Text className="mt-1 font-fredoka-semibold text-3xl text-[#161A2A]">
          Your Learning Path
        </Text>

        <Text className="mt-2 font-nunito text-base leading-6 text-[#777B87]">
          {description}
        </Text>
      </View>
    </AnimatedEntrance>
  );
}

function PathSummary({
  completed,
  total,
  overall,
}: {
  completed: number;
  total: number;
  overall: number;
}) {
  return (
    <View className="mb-6 rounded-2xl bg-white p-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-nunito-bold text-sm text-[#161A2A]">
          {completed} of {total} units complete
        </Text>
        <CountUp
          value={overall}
          className="font-nunito-bold text-sm text-primary"
        />
      </View>

      <View className="mt-3">
        <ProgressBar progress={overall} />
      </View>
    </View>
  );
}

export default function LearnScreen() {
  const { data, isLoading, isError } = useLearningPath();

  const path = data?.path;
  const units = path?.units ?? [];

  const completedCount = units.filter((u) => u.status === "completed").length;
  const currentUnit = units.find((u) => u.status === "current");
  const overall = units.length
    ? Math.round(
        ((completedCount + (currentUnit?.progress ?? 0) / 100) / units.length) *
          100,
      )
    : 0;

  // Scroll the current unit into view once layout is known.
  const scrollRef = useRef<ScrollView>(null);
  const listY = useRef<number | null>(null);
  const currentY = useRef<number | null>(null);
  const didScroll = useRef(false);

  const maybeScrollToCurrent = () => {
    if (didScroll.current) return;
    if (listY.current === null || currentY.current === null) return;

    didScroll.current = true;
    const y = Math.max(listY.current + currentY.current - 140, 0);

    setTimeout(() => {
      scrollRef.current?.scrollTo({ y, animated: true });
    }, 700);
  };

  return (
    <View className="flex-1 bg-[#F8F7FC]">
      <ScrollView
        ref={scrollRef}
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

        {!isLoading && !isError && path && units.length > 0 && (
          <View
            className="px-5"
            onLayout={(event) => {
              listY.current = event.nativeEvent.layout.y;
              maybeScrollToCurrent();
            }}
          >
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

            <PathSummary
              completed={completedCount}
              total={units.length}
              overall={overall}
            />

            {units.map((unit, index) => (
              <UnitNode
                key={unit.id}
                unit={unit}
                index={index}
                isLast={index === units.length - 1}
                onNodeLayout={
                  unit.status === "current"
                    ? (event) => {
                        currentY.current = event.nativeEvent.layout.y;
                        maybeScrollToCurrent();
                      }
                    : undefined
                }
                onPress={() =>
                  router.push({
                    pathname: "/unit/[id]",
                    params: { id: unit.id },
                  })
                }
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
