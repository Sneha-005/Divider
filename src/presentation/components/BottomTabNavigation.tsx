import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';

interface BottomTabNavigationProps {
  activeTab: 'home' | 'chart' | 'portfolio' | 'alert' | 'profile';
  onTabPress: (tab: 'home' | 'chart' | 'portfolio' | 'alert' | 'profile') => void;
}

const TABS = [
  { name: 'home', icon: '🏠', label: 'Home' },
  { name: 'chart', icon: '📊', label: 'Chart' },
  { name: 'portfolio', icon: '📈', label: 'Portfolio' },
  { name: 'alert', icon: '🔔', label: 'Alert' },
  { name: 'profile', icon: '👤', label: 'Profile' },
] as const;

export const BottomTabNavigation: React.FC<BottomTabNavigationProps> = ({
  activeTab,
  onTabPress,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        {/* Glassmorphic Background */}
        <View style={styles.glassBackground} />

        {/* Tabs Container */}
        <View style={styles.tabsContainer}>
          {TABS.map((tab, index) => {
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
    height: 80,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    // Glassmorphism effect
    backdropFilter: 'blur(10px)',
    marginHorizontal: 12,
    marginVertical: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 20,
    position: 'relative',
  },
  activeTabButton: {
    backgroundColor: 'rgba(30, 64, 175, 0.15)',
    borderRadius: 20,
  },
  activeIndicator: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1E40AF',
    bottom: 4,
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
    color: '#94A3B8',
  },
  activeIcon: {
    fontSize: 26,
    color: '#1E40AF',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    textAlign: 'center',
  },
  activeLabel: {
    color: '#1E40AF',
    fontWeight: '700',
    fontSize: 12,
  },
});

export default BottomTabNavigation;
