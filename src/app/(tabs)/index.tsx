import { ScrollView, View } from "react-native";

import ContinueLearningCard from "@/components/home/ContinueLearningCard";
import DailyTip from "@/components/home/DailyTip";
import HomeHeader from "@/components/home/HomeHeader";
import ProgressCard from "@/components/home/ProgressCard";
import TodaysFocus from "@/components/home/TodaysFocus";

export default function Index() {
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <HomeHeader />
        <ContinueLearningCard />
        <TodaysFocus />
        <ProgressCard />
        <DailyTip />
      </ScrollView>
    </View>
  );
}
