import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../shared/theme/colors';
import { validators, getPasswordErrorMessage } from '../../shared/validators';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { useAuth } from '../hooks/useAuth';

interface LoginScreenProps {
  onNavigateToSignup: () => void;
  onLoginSuccess?: (email?: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToSignup,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const emailInputRef = React.useRef<any>(null);
  const passwordInputRef = React.useRef<any>(null);

  const { login, loading, error: authError } = useAuth();

  // Real-time email validation
  const handleEmailChange = (text: string) => {
    setEmail(text);
    setApiError(null);

    if (!text) {
      setEmailError('Email is required');
    } else if (!validators.email(text)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError(null);
    }
  };

  // Real-time password validation with regex check
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setApiError(null);

    const passwordErrorMsg = getPasswordErrorMessage(text);
    if (passwordErrorMsg) {
      setPasswordError(passwordErrorMsg);
    } else {
      setPasswordError(null);
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validators.email(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    }

    // Validate password strength
    const passwordErrorMsg = getPasswordErrorMessage(password);
    if (passwordErrorMsg) {
      setPasswordError(passwordErrorMsg);
      isValid = false;
    } else {
      setPasswordError(null);
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login({ email, password });
      if (result.success) {
        setEmail('');
        setPassword('');
        setEmailError(null);
        setPasswordError(null);
        setApiError(null);
        onLoginSuccess?.(email);
      } else {
        // Show API error message
        setApiError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setApiError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <LoadingOverlay visible={loading} message="Logging in..." />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Divider</Text>
        <Text style={styles.subtitle}>Stock Market Analytics</Text>
      </View>

      {/* Error Message */}
      {(authError || apiError) && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{authError || apiError}</Text>
        </View>
      )}

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          ref={emailInputRef}
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={handleEmailChange}
          error={emailError}
          editable={!loading}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => passwordInputRef.current?.focus()}
        />

        <TextInput
          ref={passwordInputRef}
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={handlePasswordChange}
          error={passwordError}
          editable={!loading}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={() => passwordInputRef.current?.blur()}
        />

        <Button
          title="Login"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
        />
      </View>

      {/* Signup Link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={onNavigateToSignup}>
          <Text style={styles.linkText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorBanner: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorBannerText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  form: {
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;
