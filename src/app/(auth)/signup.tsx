import { useAuth, useSignUp } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
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

export default function SignupScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { signUp } = useSignUp();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!isLoaded) return;

    if (!firstName.trim() || !email.trim() || !password) {
      Alert.alert("Missing information", "Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await signUp.password({
        emailAddress: email.trim(),
        password,
      });

      if (error) {
        Alert.alert(
          "Signup failed",
          error.longMessage || error.message || "Unable to create account.",
        );
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();

      if (sendError) {
        Alert.alert(
          "Verification error",
          sendError.longMessage ||
            sendError.message ||
            "Unable to send verification code.",
        );
        return;
      }

      setPendingVerification(true);
    } catch (error: any) {
      console.log("Signup error:", error);

      const message =
        error?.errors?.[0]?.longMessage ||
        error?.errors?.[0]?.message ||
        "Something went wrong while creating your account.";

      Alert.alert("Signup failed", message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;

    if (!code.trim()) {
      Alert.alert(
        "Verification code",
        "Please enter the code we sent to your email.",
      );
      return;
    }

    try {
      setLoading(true);
      const { error } = await signUp.verifications.verifyEmailCode({
        code: code.trim(),
      });

      if (error) {
        Alert.alert(
          "Verification failed",
          error.longMessage || error.message || "Invalid verification code.",
        );
        return;
      }

      const { error: finalizeError } = await signUp.finalize();

      if (finalizeError) {
        Alert.alert(
          "Signup incomplete",
          finalizeError.longMessage ||
            finalizeError.message ||
            "Unable to complete your account setup.",
        );
        return;
      }
      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("Verification error:", error);

      const message =
        error?.errors?.[0]?.longMessage ||
        error?.errors?.[0]?.message ||
        "Invalid verification code.";

      Alert.alert("Verification failed", message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);

      const { error } = await signUp.verifications.sendEmailCode();

      if (error) {
        Alert.alert(
          "Unable to resend",
          error.longMessage ||
            error.message ||
            "Unable to send a new verification code.",
        );
        return;
      }

      Alert.alert("Code sent", "We've sent you a new verification code.");
    } catch (error: any) {
      console.log("Resend error:", error);

      Alert.alert(
        "Unable to resend",
        "Something went wrong. Please try again.",
      );
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

  if (isSignedIn) {
    router.replace("/(tabs)");
    return null;
  }

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView
        className="flex-1 bg-background"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 70,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1">
            <TouchableOpacity
              onPress={() => setPendingVerification(false)}
              className="mb-10 h-11 w-11 items-center justify-center rounded-full bg-white"
            >
              <Ionicons name="arrow-back" size={22} color="#161A2A" />
            </TouchableOpacity>

            {/* Icon */}
            <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-purple-100">
              <Ionicons name="mail" size={38} color="#6554C0" />
            </View>

            <Text className="font-fredoka-bold text-4xl text-[#161A2A]">
              Check your email
            </Text>

            <Text className="mt-3 font-nunito text-base leading-6 text-[#777B87]">
              We've sent a verification code to
            </Text>

            <Text className="mt-1 font-nunito-bold text-base text-[#161A2A]">
              {email}
            </Text>

            {/* Code */}
            <View className="mt-10">
              <Text className="mb-2 font-nunito-semibold text-sm text-[#161A2A]">
                Verification code
              </Text>

              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#A1A4AE"
                keyboardType="number-pad"
                maxLength={6}
                className="h-14 rounded-2xl border border-gray-200 bg-white px-4 text-center font-nunito-bold text-xl tracking-[5px] text-[#161A2A]"
              />
            </View>

            {/* Verify */}
            <TouchableOpacity
              onPress={handleVerify}
              disabled={loading}
              className="mt-6 h-14 flex-row items-center justify-center rounded-2xl bg-primary"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text className="font-nunito-bold text-base text-white">
                    Verify Email
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

            {/* Resend */}
            <View className="mt-6 items-center">
              <Text className="font-nunito text-sm text-[#777B87]">
                Didn't receive the code?
              </Text>

              <TouchableOpacity onPress={handleResendCode} disabled={loading}>
                <Text className="mt-1 font-nunito-bold text-sm text-primary">
                  Resend code
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
          paddingTop: 55,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8">
          <Text className="font-fredoka-bold text-4xl text-[#161A2A]">
            Create your account
          </Text>

          <Text className="mt-3 max-w-[330px] font-nunito text-base leading-6 text-[#777B87]">
            Start your German learning journey and build your skills step by
            step.
          </Text>
        </View>

        {/* First name */}
        <View className="mb-4">
          <Text className="mb-2 font-nunito-semibold text-sm text-[#161A2A]">
            First name
          </Text>

          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="John"
            placeholderTextColor="#A1A4AE"
            autoCapitalize="words"
            className="h-14 rounded-2xl border border-gray-200 bg-white px-4 font-nunito text-base text-[#161A2A]"
          />
        </View>

        {/* Last name */}
        <View className="mb-4">
          <Text className="mb-2 font-nunito-semibold text-sm text-[#161A2A]">
            Last name
            <Text className="font-nunito text-[#999CA5]"> (optional)</Text>
          </Text>

          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Doe"
            placeholderTextColor="#A1A4AE"
            autoCapitalize="words"
            className="h-14 rounded-2xl border border-gray-200 bg-white px-4 font-nunito text-base text-[#161A2A]"
          />
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="mb-2 font-nunito-semibold text-sm text-[#161A2A]">
            Email address
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#A1A4AE"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            className="h-14 rounded-2xl border border-gray-200 bg-white px-4 font-nunito text-base text-[#161A2A]"
          />
        </View>

        {/* Password */}
        <View className="mb-2">
          <Text className="mb-2 font-nunito-semibold text-sm text-[#161A2A]">
            Password
          </Text>

          <View className="h-14 flex-row items-center rounded-2xl border border-gray-200 bg-white px-4">
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              placeholderTextColor="#A1A4AE"
              secureTextEntry={!showPassword}
              className="flex-1 font-nunito text-base text-[#161A2A]"
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

        <Text className="mb-6 font-nunito text-xs leading-5 text-[#999CA5]">
          Use at least 8 characters with a mix of letters and numbers.
        </Text>

        {/* Signup */}
        <TouchableOpacity
          onPress={handleSignup}
          disabled={loading}
          className="h-14 flex-row items-center justify-center rounded-2xl bg-primary"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text className="font-nunito-bold text-base text-white">
                Create Account
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

        {/* Login */}
        <View className="mt-7 flex-row items-center justify-center">
          <Text className="font-nunito text-sm text-[#777B87]">
            Already have an account?{" "}
          </Text>

          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="font-nunito-bold text-sm text-primary">
                Log in
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Terms */}
        <Text className="mt-7 text-center font-nunito text-xs leading-5 text-[#999CA5]">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy.
        </Text>

        {/* Required for Clerk Expo web CAPTCHA */}
        <View nativeID="clerk-captcha" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
