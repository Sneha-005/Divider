import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleUseDemoCredentials = () => {
    setEmail('harsh2004416@gmail.com');
    setPassword('SecurePass123!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        {/* Logo */}
        <Text style={styles.logo}>📱</Text>

        {/* Title */}
        <Text style={styles.title}>StockTrack</Text>
        <Text style={styles.subtitle}>Trading Made Simple</Text>

        {/* Inputs */}
        <TextInput
          placeholder="Email Address"
          style={styles.input}
          keyboardType="email-address"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
        />

        {/* Sign In Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Divider */}
        <Text style={styles.demoText}>Demo Account</Text>

        {/* Demo Button */}
        <TouchableOpacity style={styles.demoButton} onPress={handleUseDemoCredentials}>
          <Text style={styles.demoButtonText}>
            Use Demo Credentials
          </Text>
        </TouchableOpacity>

        {/* Demo Credentials */}
        <Text style={styles.credentials}>
          Demo: harsh2004416@gmail.com
        </Text>
        <Text style={styles.credentials}>
          Pass: SecurePass123!
        </Text>

        {/* Signup Link */}
        <View style={styles.signupLinkContainer}>
          <Text style={styles.signupLinkText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/SignupScreen')}>
            <Text style={styles.signupLinkButton}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

export default LoginScreen;

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
  button: {
    width: '100%',
    backgroundColor: '#3b5bdb',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  demoText: {
    marginVertical: 15,
    color: 'gray',
  },
  demoButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#3b5bdb',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  demoButtonText: {
    color: '#3b5bdb',
    fontWeight: 'bold',
  },
  credentials: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  signupLinkContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupLinkText: {
    color: 'gray',
    fontSize: 14,
  },
  signupLinkButton: {
    color: '#3b5bdb',
    fontWeight: 'bold',
    fontSize: 14,
  },
});