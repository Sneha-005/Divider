import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[HomeScreen] Component mounted successfully");
    return () => console.log("[HomeScreen] Component unmounting");
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Error Detected:</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  try {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Divider</Text>
        <Text style={styles.subtitle}>React Native App</Text>
      </View>
    );
  } catch (err: any) {
    const errorMsg = err?.message || "Unknown error";
    console.error("[HomeScreen] Render error:", errorMsg);
    setError(errorMsg);
    throw err;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: "#888",
  },
});
