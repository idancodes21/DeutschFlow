import { login } from "@/features/auth/auth.service";
import { getAuthErrorMessage } from "@/utils/authErrors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        "Missing information",
        "Please enter your email and password.",
      );
      return;
    }

    try {
      setLoading(true);

      await login(email.trim(), password);

      // Auth state will handle navigation.
    } catch (error: any) {
      console.log(error);

      Alert.alert("Login failed", getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingBottom: 30,
          }}
        >
          {/* Back */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 h-10 w-10 items-center justify-center rounded-full bg-white"
          >
            <Ionicons name="arrow-back" size={22} color="#161A2A" />
          </TouchableOpacity>

          {/* Heading */}
          <View className="mt-10">
            <Text className="font-fredoka-semibold text-3xl text-[#161A2A]">
              Welcome back! 👋
            </Text>

            <Text className="mt-2 font-nunito text-base leading-6 text-[#777B87]">
              Continue your German learning journey.
            </Text>
          </View>

          {/* Form */}
          <View className="mt-10">
            <Text className="mb-2 font-nunito-semibold text-sm text-[#161A2A]">
              Email
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#999DA8"
              keyboardType="email-address"
              autoCapitalize="none"
              className="h-14 rounded-2xl border border-gray-200 bg-white px-4 font-nunito text-base text-[#161A2A]"
            />

            <Text className="mb-2 mt-5 font-nunito-semibold text-sm text-[#161A2A]">
              Password
            </Text>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#999DA8"
              secureTextEntry
              className="h-14 rounded-2xl border border-gray-200 bg-white px-4 font-nunito text-base text-[#161A2A]"
            />

            <TouchableOpacity className="mt-3 self-end">
              <Text className="font-nunito-semibold text-sm text-primary">
                Forgot password?
              </Text>
            </TouchableOpacity>

            {/* Login */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className="mt-7 h-14 items-center justify-center rounded-2xl bg-primary"
            >
              <Text className="font-nunito-bold text-base text-white">
                {loading ? "Logging in..." : "Log In"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Signup */}
          <View className="mt-auto flex-row items-center justify-center pt-10">
            <Text className="font-nunito text-sm text-[#777B87]">
              Don't have an account?{" "}
            </Text>

            <TouchableOpacity onPress={() => router.push("/")}>
              <Text className="font-nunito-bold text-sm text-primary">
                Create account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
