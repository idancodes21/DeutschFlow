import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
export default function Index() {
  return (
    <SafeAreaView>
      <Text className="text-red-500">Edit src/app/index.tsx to edit this screen.</Text>
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
    </SafeAreaView>
  );
}


