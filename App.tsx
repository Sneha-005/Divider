import React, { useState, useEffect } from 'react';
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
import { AuthLocalDataSource } from './src/data/datasources/local/auth.local.datasource';

const localDataSource = new AuthLocalDataSource();

type AuthScreen = 'login' | 'signup';
type TabScreen = 'home' | 'chart' | 'portfolio' | 'alert' | 'profile';
type AppScreen = AuthScreen | TabScreen;

function App(): React.JSX.Element {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabScreen>('home');
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await localDataSource.getToken();
        if (token) {
          const user = await localDataSource.getUserData();
          if (user) {
            setUserName(user.username || user.email?.split('@')[0]);
          }
          setIsAuthenticated(true);
        }
      } catch (e) {
        // Restoring token failed
      } finally {
        setIsInitializing(false);
      }
    };
    bootstrapAsync();
  }, []);

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

  const handleLogout = async () => {
    await localDataSource.clearAuthData();
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
        return <ProfileScreen />;
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

  if (isInitializing) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      </View>
    );
  }

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
          backgroundColor: '#FFFFFF',
        },
      ]}
      edges={['top']}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
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
