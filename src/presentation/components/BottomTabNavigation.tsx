import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';

interface BottomTabNavigationProps {
  activeTab: 'home' | 'chart' | 'portfolio' | 'alert' | 'profile';
  onTabPress: (tab: 'home' | 'chart' | 'portfolio' | 'alert' | 'profile') => void;
}

const TABS = [
  { name: 'home', icon: '🏠', label: 'Home' },
  { name: 'chart', icon: '📊', label: 'Chart' },
  { name: 'portfolio', icon: '💼', label: 'Portfolio' },
  { name: 'alert', icon: '🔔', label: 'Alert' },
  { name: 'profile', icon: '👤', label: 'Profile' },
] as const;

export const BottomTabNavigation: React.FC<BottomTabNavigationProps> = ({
  activeTab,
  onTabPress,
}) => {
  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        {/* Glassmorphic Background */}
        <View style={styles.glassBackground} />

        {/* Tabs Container */}
        <View style={styles.tabsContainer}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.name;

            return (
              <TouchableOpacity
                key={tab.name}
                style={[styles.tabButton, isActive && styles.activeTabButton]}
                onPress={() => onTabPress(tab.name as any)}
                activeOpacity={0.7}
              >
                {/* Active Indicator Circle */}
                {isActive && <View style={styles.activeIndicator} />}

                {/* Icon */}
                <Text style={[styles.icon, isActive && styles.activeIcon]}>
                  {tab.icon}
                </Text>

                {/* Label */}
                <Text
                  style={[
                    styles.label,
                    isActive && styles.activeLabel,
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
  },
  container: {
    position: 'relative',
    height: 75,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  glassBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 29, 46, 0.95)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
    zIndex: 1001,
  },
  tabButton: {
    flex: 1,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 16,
    position: 'relative',
  },
  activeTabButton: {
    backgroundColor: 'rgba(30, 64, 175, 0.15)',
    borderRadius: 16,
  },
  activeIndicator: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#00D084',
    bottom: 6,
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
    color: '#B0B8D4',
  },
  activeIcon: {
    fontSize: 26,
    color: '#00D084',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#B0B8D4',
    textAlign: 'center',
  },
  activeLabel: {
    color: '#00D084',
    fontWeight: '700',
    fontSize: 11,
  },
});

export default BottomTabNavigation;
