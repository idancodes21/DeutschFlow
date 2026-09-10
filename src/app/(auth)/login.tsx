import { useAuth, useSignIn } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  const { isLoaded, isSignedIn } = useAuth();
  const { signIn } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [isSignedIn, router]);

  const handleLogin = async () => {
    if (!isLoaded) return;

    if (!email.trim() || !password) {
      Alert.alert(
        "Missing information",
        "Please enter your email and password.",
      );
      return;
    }

    try {
      setLoading(true);

      const { error } = await signIn.password({
        identifier: email.trim(),
        password,
      });

      if (error) {
        Alert.alert(
          "Login failed",
          error.longMessage ||
            error.message ||
            "Unable to sign in. Please check your credentials.",
        );
        return;
      }

      console.log("Sign-in status:", signIn.status);

      if (signIn.status === "complete") {
        const { error: finalizeError } = await signIn.finalize();

        if (finalizeError) {
          Alert.alert(
            "Login failed",
            finalizeError.longMessage ||
              finalizeError.message ||
              "Unable to complete sign in.",
          );
          return;
        }

        console.log("Login finalized successfully");
      } else {
        console.log("Sign-in requires additional steps:", signIn.status);

        Alert.alert(
          "Additional verification required",
          `Sign-in status: ${signIn.status}`,
        );
      }
    } catch (error: any) {
      console.log("Login error:", error);

      const message =
        error?.errors?.[0]?.longMessage ||
        error?.errors?.[0]?.message ||
        error?.message ||
        "Unable to sign in. Please try again.";

      Alert.alert("Login failed", message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#6554C0" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 65,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-10">
          <Text className="font-fredoka-bold text-4xl text-[#161A2A]">
            Welcome back!
          </Text>

          <Text className="mt-3 max-w-[330px] font-nunito text-base leading-6 text-[#777B87]">
            Ready to continue your German learning journey?
          </Text>
        </View>

        {/* Email */}
        <View className="mb-5">
          <Text className="mb-2 font-nunito-semibold text-sm text-[#161A2A]">
            Email address
          </Text>

          <View className="h-14 flex-row items-center rounded-2xl border border-gray-200 bg-white px-4">
            <Ionicons name="mail-outline" size={20} color="#777B87" />

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#A1A4AE"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className="ml-3 flex-1 font-nunito text-base text-[#161A2A]"
            />
          </View>
        </View>

        {/* Password */}
        <View>
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="font-nunito-semibold text-sm text-[#161A2A]">
              Password
            </Text>

            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity>
                <Text className="font-nunito-semibold text-sm text-primary">
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          <View className="h-14 flex-row items-center rounded-2xl border border-gray-200 bg-white px-4">
            <Ionicons name="lock-closed-outline" size={20} color="#777B87" />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#A1A4AE"
              secureTextEntry={!showPassword}
              className="ml-3 flex-1 font-nunito text-base text-[#161A2A]"
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#777B87"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Login */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="mt-7 h-14 flex-row items-center justify-center rounded-2xl bg-primary"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text className="font-nunito-bold text-base text-white">
                Log In
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color="white"
                style={{ marginLeft: 8 }}
              />
            </>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View className="my-8 flex-row items-center">
          <View className="h-[1px] flex-1 bg-gray-200" />

          <Text className="mx-4 font-nunito text-xs text-[#999CA5]">OR</Text>

          <View className="h-[1px] flex-1 bg-gray-200" />
        </View>

        {/* Google */}
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Coming soon",
              "Google authentication will be added next.",
            )
          }
          className="h-14 flex-row items-center justify-center rounded-2xl border border-gray-200 bg-white"
        >
          <Text className="mr-3 font-nunito-bold text-lg">G</Text>

          <Text className="font-nunito-semibold text-base text-[#161A2A]">
            Continue with Google
          </Text>
        </TouchableOpacity>

        {/* Signup */}
        <View className="mt-8 flex-row items-center justify-center">
          <Text className="font-nunito text-sm text-[#777B87]">
            Don't have an account?{" "}
          </Text>

          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity>
              <Text className="font-nunito-bold text-sm text-primary">
                Sign up
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Small encouragement */}
        <View className="mt-auto items-center pt-12">
          <Text className="text-2xl">🇩🇪</Text>

          <Text className="mt-2 font-fredoka-semibold text-base text-[#555968]">
            Los geht's!
          </Text>

          <Text className="mt-1 font-nunito text-xs text-[#999CA5]">
            Let's start learning.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
