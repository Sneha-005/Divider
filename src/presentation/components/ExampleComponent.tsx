/**
 * Example Component
 * Place all your reusable UI components here
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ExampleComponentProps {
  title: string;
  description?: string;
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  description,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
