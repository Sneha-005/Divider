import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../src/shared/theme/colors";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Divider</Text>
        <Text style={styles.subtitle}>Stock Trading Platform</Text>

        <View style={styles.spacer} />

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 20,
  },
  spacer: {
    flex: 1,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: Colors.button.primary,
    borderRadius: 10,
    marginBottom: 40,
  },
  buttonText: {
    color: Colors.button.primaryText,
    fontSize: 16,
    fontWeight: "700",
  },
});
