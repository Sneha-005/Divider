/**
 * Root Navigation Layout
 * Handles main routing structure
 */

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Colors } from "@shared/theme/colors";

export default function RootLayout() {
  React.useEffect(() => {
    console.log("[RootLayout] App initialized");
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
          contentStyle: {
            backgroundColor: Colors.background,
          },
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
