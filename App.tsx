import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  SafeAreaView,
  View,
} from 'react-native';
import { colors } from './src/shared/theme/colors';
import LoginScreen from './src/presentation/screens/LoginScreen';
import SignupScreen from './src/presentation/screens/SignupScreen';
import HomeScreen from './src/presentation/screens/HomeScreen';
import PortfolioScreen from './src/presentation/screens/PortfolioScreen';
import ChartScreen from './src/presentation/screens/ChartScreen';
import AlertScreen from './src/presentation/screens/AlertScreen';
import ProfileScreen from './src/presentation/screens/ProfileScreen';
import { BottomTabNavigation } from './src/presentation/components/BottomTabNavigation';

type AuthScreen = 'login' | 'signup';
type TabScreen = 'home' | 'chart' | 'portfolio' | 'alert' | 'profile';
type AppScreen = AuthScreen | TabScreen;

function App(): React.JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabScreen>('home');
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  const handleLoginSuccess = (email?: string) => {
    setUserName(email?.split('@')[0]);
    setIsAuthenticated(true);
    setCurrentTab('home');
  };

  const handleSignupSuccess = (username?: string) => {
    setUserName(username);
    setIsAuthenticated(true);
    setCurrentTab('home');
  };

  const handleLogout = () => {
    setUserName(undefined);
    setIsAuthenticated(false);
    setAuthScreen('login');
  };

  const renderTabScreen = () => {
    switch (currentTab) {
      case 'home':
        return <HomeScreen />;
      case 'chart':
        return <ChartScreen />;
      case 'portfolio':
        return <PortfolioScreen />;
      case 'alert':
        return <AlertScreen />;
      case 'profile':
        return <ProfileScreen onLogout={handleLogout} />;
      default:
        return <HomeScreen />;
    }
  };

  const renderAuthScreen = () => {
    switch (authScreen) {
      case 'login':
        return (
          <LoginScreen
            onNavigateToSignup={() => setAuthScreen('signup')}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case 'signup':
        return (
          <SignupScreen
            onNavigateToLogin={() => setAuthScreen('login')}
            onSignupSuccess={handleSignupSuccess}
          />
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.background}
        />
        {renderAuthScreen()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.screenBackground,
        },
      ]}
      edges={['top']}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.screenBackground}
      />
      <View style={styles.content}>
        {renderTabScreen()}
      </View>

      {/* Bottom Tab Navigation */}
      <BottomTabNavigation
        activeTab={currentTab}
        onTabPress={setCurrentTab}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default App;
