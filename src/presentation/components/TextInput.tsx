import React, { useState } from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../shared/theme/colors';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string | null;
  returnKeyType?: 'next' | 'done' | 'go' | 'search' | 'send' | 'default';
  onSubmitEditing?: () => void;
}

const TextInputComponent = React.forwardRef<RNTextInput, CustomTextInputProps>(
  ({ label, error, onSubmitEditing, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPasswordField = props.secureTextEntry !== undefined && props.secureTextEntry !== false;
    const secureEntry = isPasswordField ? !isPasswordVisible : false;

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.inputWrapper}>
          <RNTextInput
            ref={ref}
            style={[
              styles.input,
              error && styles.inputError,
              isPasswordField && styles.inputWithEye,
              props.style,
            ]}
            placeholderTextColor={colors.textSecondary}
            onSubmitEditing={onSubmitEditing}
            {...props}
            secureTextEntry={secureEntry}
          />
          {isPasswordField && (
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              activeOpacity={0.7}
            >
              <Text style={styles.eyeText}>{isPasswordVisible ? '👁' : '🔒'}</Text>
            </TouchableOpacity>
          )}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

TextInputComponent.displayName = 'TextInput';

export const TextInput = TextInputComponent;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16,
    backgroundColor: colors.surface,
  },
  inputWithEye: {
    paddingRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  eyeText: {
    fontSize: 18,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});
