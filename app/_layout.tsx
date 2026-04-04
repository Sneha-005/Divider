import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../src/shared/theme/colors";

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.background,
          },
          animationEnabled: true,
        }}
      >
        {/* Auth Screens */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />

        {/* App Screens */}
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}