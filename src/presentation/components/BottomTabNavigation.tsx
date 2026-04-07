import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../shared/theme/colors';

interface BottomTabNavigationProps {
  activeTab: 'home' | 'chart' | 'portfolio' | 'alert' | 'profile';
  onTabPress: (tab: 'home' | 'chart' | 'portfolio' | 'alert' | 'profile') => void;
}

const TABS = [
  { name: 'home', icon: 'home-outline', activeIcon: 'home', label: 'Home' },
  { name: 'chart', icon: 'chart-line', activeIcon: 'chart-line-variant', label: 'Chart' },
  { name: 'portfolio', icon: 'briefcase-variant-outline', activeIcon: 'briefcase-variant', label: 'Portfolio' },
  { name: 'alert', icon: 'bell-outline', activeIcon: 'bell', label: 'Alert' },
  { name: 'profile', icon: 'account-circle-outline', activeIcon: 'account-circle', label: 'Profile' },
] as const;

export const BottomTabNavigation: React.FC<BottomTabNavigationProps> = ({
  activeTab,
  onTabPress,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
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
                <MaterialCommunityIcons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={isActive ? 24 : 22}
                  color={isActive ? colors.primary : colors.textSecondary}
                  style={styles.icon}
                />

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
    backgroundColor: colors.background,
  },
  container: {
    position: 'relative',
    height: 75,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: colors.background,
  },
  glassBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 31, 58, 0.98)',
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
    backgroundColor: colors.primary,
    bottom: 6,
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 11,
  },
});

export default BottomTabNavigation;
