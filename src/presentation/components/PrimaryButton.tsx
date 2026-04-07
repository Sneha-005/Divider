/**
 * Primary Button Component
 * Stock market themed button with loading state
 */

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  GestureResponderEvent,
} from "react-native";
import { Colors } from "../../shared/theme/colors";

interface PrimaryButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  style?: any;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  style,
}) => {
  const isDisabled = disabled || loading;
  const backgroundColor =
    variant === "primary" ? Colors.button.primary : Colors.button.secondary;
  const buttonTextColor =
    variant === "primary" ? Colors.button.primaryText : Colors.text.primary;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isDisabled
            ? Colors.button.disabled
            : backgroundColor,
        },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "primary"
              ? Colors.button.primaryText
              : Colors.text.primary
          }
        />
      ) : (
        <Text
          style={[
            styles.text,
            { color: isDisabled ? Colors.button.disabledText : buttonTextColor },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
    minHeight: 48,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
});
