/**
 * Text Input Field Component
 * Reusable input with validation error display
 */

import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { Colors } from "../../shared/theme/colors";

interface TextInputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  editable?: boolean;
}

export const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  editable = true,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : styles.inputNormal,
          !editable && styles.inputDisabled,
        ]}
        placeholder={placeholder}
        placeholderTextColor={Colors.input.placeholderText}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        editable={editable}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
  },
  inputNormal: {
    backgroundColor: Colors.input.background,
    borderColor: Colors.input.border,
  },
  inputError: {
    backgroundColor: Colors.input.background,
    borderColor: Colors.error,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },
});
