import { signUp } from "@/features/auth/auth.service";
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

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Missing information", "Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Password too short",
        "Your password must contain at least 6 characters.",
      );
      return;
    }

    try {
      setLoading(true);

      await signUp(name.trim(), email.trim(), password);
    } catch (error: any) {
      console.log(error);

      Alert.alert("Sign up failed", getAuthErrorMessage(error.code));
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
              Create your account
            </Text>

            <Text className="mt-2 font-nunito text-base leading-6 text-[#777B87]">
              Start your journey to speaking German confidently.
            </Text>
          </View>

          {/* Form */}
          <View className="mt-8">
            {/* Name */}
            <Text className="mb-2 font-nunito-semibold text-sm text-[#161A2A]">
              Your name
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="What should we call you?"
              placeholderTextColor="#999DA8"
              autoCapitalize="words"
              className="h-14 rounded-2xl border border-gray-200 bg-white px-4 font-nunito text-base text-[#161A2A]"
            />

            {/* Email */}
            <Text className="mb-2 mt-5 font-nunito-semibold text-sm text-[#161A2A]">
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

            {/* Password */}
            <Text className="mb-2 mt-5 font-nunito-semibold text-sm text-[#161A2A]">
              Password
            </Text>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              placeholderTextColor="#999DA8"
              secureTextEntry
              className="h-14 rounded-2xl border border-gray-200 bg-white px-4 font-nunito text-base text-[#161A2A]"
            />

            <Text className="mt-2 font-nunito text-xs text-[#777B87]">
              Use at least 6 characters.
            </Text>

            {/* Create account */}
            <TouchableOpacity
              onPress={handleSignup}
              disabled={loading}
              className="mt-7 h-14 items-center justify-center rounded-2xl bg-primary"
            >
              <Text className="font-nunito-bold text-base text-white">
                {loading ? "Creating account..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login */}
          <View className="mt-8 flex-row items-center justify-center">
            <Text className="font-nunito text-sm text-[#777B87]">
              Already have an account?{" "}
            </Text>

            <TouchableOpacity onPress={() => router.push("/")}>
              <Text className="font-nunito-bold text-sm text-primary">
                Log in
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
