import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ContinueLearningCard() {
  return (
    <View className="-mt-12 px-5">
      <View className="overflow-hidden rounded-[22px] border border-gray-100 bg-white p-4 shadow-sm">
        <View className="flex-row items-center">
          <View className="mr-3 h-20 w-20 items-center justify-center rounded-full bg-purple-100">
            <Ionicons name="book" size={40} color="#6554C0" />
          </View>

          <View className="flex-1">
            <Text className="font-nunito-semibold text-xs uppercase tracking-wide text-primary">
              Continue Learning
            </Text>

            <Text className="mt-1 font-fredoka-semibold text-xl text-[#161A2A]">
              A1 · Lesson 4
            </Text>

            <Text className="mt-1 font-nunito-semibold text-sm text-[#555968]">
              Greetings & Introductions
            </Text>
          </View>

          <Image
            source={require("../../../assets/images/hallo.jpg")}
            className="h-24 w-20"
            resizeMode="contain"
          />
        </View>

        <Text className="mt-3 pr-4 font-nunito text-sm leading-5 text-[#555968]">
          Learn how to greet people and introduce yourself in German.
        </Text>

        <View className="mt-4 flex-row items-center">
          <View className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
            <View className="h-full w-[70%] rounded-full bg-primary" />
          </View>

          <Text className="ml-3 font-nunito-bold text-sm text-primary">
            70%
          </Text>
        </View>

        <TouchableOpacity className="mt-4 h-12 flex-row items-center justify-center rounded-xl bg-primary">
          <Text className="font-nunito-bold text-base text-white">
            Continue Lesson
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="white"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
