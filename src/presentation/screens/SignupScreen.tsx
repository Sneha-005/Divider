import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const SignupScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Invalid email format';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Registration Failed', data.message || 'Failed to create account');
        return;
      }

      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => router.push('/LoginScreen'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to register. Please check your connection.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Logo */}
        <Text style={styles.logo}>📱</Text>

        {/* Title */}
        <Text style={styles.title}>StockTrack</Text>
        <Text style={styles.subtitle}>Create Your Account</Text>

        {/* Full Name Input */}
        <TextInput
          placeholder="Full Name"
          style={[styles.input, errors.fullName && styles.inputError]}
          placeholderTextColor="#666"
          value={fullName}
          onChangeText={(text) => {
            setFullName(text);
            if (errors.fullName) {
              setErrors({ ...errors, fullName: '' });
            }
          }}
          editable={!loading}
        />
        {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

        {/* Email Input */}
        <TextInput
          placeholder="Email Address"
          style={[styles.input, errors.email && styles.inputError]}
          keyboardType="email-address"
          placeholderTextColor="#666"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) {
              setErrors({ ...errors, email: '' });
            }
          }}
          editable={!loading}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Password Input */}
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={[styles.input, errors.password && styles.inputError]}
          placeholderTextColor="#666"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) {
              setErrors({ ...errors, password: '' });
            }
          }}
          editable={!loading}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        {/* Confirm Password Input */}
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          style={[styles.input, errors.confirmPassword && styles.inputError]}
          placeholderTextColor="#666"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword) {
              setErrors({ ...errors, confirmPassword: '' });
            }
          }}
          editable={!loading}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginLinkText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/LoginScreen')} disabled={loading}>
            <Text style={styles.loginLinkButton}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b5bdb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    fontSize: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'gray',
    marginBottom: 20,
    fontSize: 14,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    color: '#000',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 5,
    marginTop: -5,
    marginBottom: 5,
  },
  button: {
    width: '100%',
    backgroundColor: '#3b5bdb',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLinkContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginLinkText: {
    color: 'gray',
    fontSize: 14,
  },
  loginLinkButton: {
    color: '#3b5bdb',
    fontWeight: 'bold',
    fontSize: 14,
  },
});