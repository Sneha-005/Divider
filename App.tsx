import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { colors } from './src/shared/theme/colors';
import LoginScreen from './src/presentation/screens/LoginScreen';
import SignupScreen from './src/presentation/screens/SignupScreen';

type AuthScreen = 'login' | 'signup';

function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      {currentScreen === 'login' ? (
        <LoginScreen onNavigateToSignup={() => setCurrentScreen('signup')} />
      ) : (
        <SignupScreen onNavigateToLogin={() => setCurrentScreen('login')} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
