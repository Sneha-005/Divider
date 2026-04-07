import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Switch,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../shared/theme/colors';
import styles from './ProfileScreen.styles';
import { useProfile } from '../hooks/useProfile';

const ProfileScreen: React.FC = () => {
  const {
    profile,
    loading,
    error,
    updatingNotifications,
    loadProfile,
    updateNotificationPreference,
  } = useProfile();

  // Local state for notification preferences (independent of profile data)
  const [notificationAlerts, setNotificationAlerts] = useState(false);
  const [notificationTrades, setNotificationTrades] = useState(false);
  const [notificationNews, setNotificationNews] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [updateInProgress, setUpdateInProgress] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializePreferences = async () => {
      // Load from AsyncStorage FIRST to ensure persistence across navigation
      await loadSavedPreferences();
      // Then load fresh profile data from API
      loadProfile();
    };
    initializePreferences();
  }, [loadProfile]);

  const loadSavedPreferences = async () => {
    try {
      const saved = await AsyncStorage.getItem('notificationPreferences');
      if (saved) {
        const prefs = JSON.parse(saved);
        setNotificationAlerts(prefs.notification_alerts ?? false);
        setNotificationTrades(prefs.notification_trades ?? false);
        setNotificationNews(prefs.notification_news ?? false);
        setTwoFactorEnabled(prefs.two_factor_enabled ?? false);
        // Mark as initialized since we loaded from storage
        setIsInitialized(true);
        console.log('✓ Loaded saved preferences from storage');
      }
    } catch (err) {
      console.error('Failed to load saved preferences:', err);
    }
  };

  const savePreferencesToStorage = async (
    alerts: boolean,
    trades: boolean,
    news: boolean,
    twoFactor: boolean
  ) => {
    try {
      await AsyncStorage.setItem(
        'notificationPreferences',
        JSON.stringify({
          notification_alerts: alerts,
          notification_trades: trades,
          notification_news: news,
          two_factor_enabled: twoFactor,
        })
      );
      console.log('💾 Saved preferences to local storage');
    } catch (err) {
      console.error('Failed to save preferences:', err);
    }
  };

  // Only update local state on initial profile load, never override after
  useEffect(() => {
    if (profile && !isInitialized) {
      setNotificationAlerts(profile?.notification_alerts || false);
      setNotificationTrades(profile?.notification_trades || false);
      setNotificationNews(profile?.notification_news || false);
      setTwoFactorEnabled(profile?.two_factor_enabled || false);
      setIsInitialized(true);
      console.log('✓ Profile preferences initialized');
    }
  }, [profile, isInitialized]);

  const handleNotificationToggle = async (
    key: string,
    value: boolean
  ) => {
    setUpdateInProgress(key);
    try {
      // Save to local storage immediately for persistence
      if (key === 'notification_alerts') {
        await savePreferencesToStorage(value, notificationTrades, notificationNews, twoFactorEnabled);
      } else if (key === 'notification_trades') {
        await savePreferencesToStorage(notificationAlerts, value, notificationNews, twoFactorEnabled);
      } else if (key === 'notification_news') {
        await savePreferencesToStorage(notificationAlerts, notificationTrades, value, twoFactorEnabled);
      } else if (key === 'two_factor_enabled') {
        await savePreferencesToStorage(notificationAlerts, notificationTrades, notificationNews, value);
      }

      // Also send to API
      await updateNotificationPreference(key as keyof typeof profile, value);
      console.log(`✓ ${key} updated to ${value}`);
    } catch (err) {
      // Silently handle error - toggle state remains updated locally
      console.error(`Failed to update ${key}:`, err);
    } finally {
      setUpdateInProgress(null);
    }
  };

  const handleToggleAllNotifications = async (value: boolean) => {
    setUpdateInProgress('all');
    try {
      // Save to local storage immediately
      await savePreferencesToStorage(value, value, value, twoFactorEnabled);

      // Update device state first
      setNotificationAlerts(value);
      setNotificationTrades(value);
      setNotificationNews(value);

      // Also send to API in parallel
      await Promise.all([
        updateNotificationPreference('notification_alerts', value),
        updateNotificationPreference('notification_trades', value),
        updateNotificationPreference('notification_news', value),
      ]);
      
      console.log(`✓ All notifications updated to ${value}`);
    } catch (err) {
      // Silently handle error - toggle states remain updated locally
      console.error('Failed to update all notifications:', err);
    } finally {
      setUpdateInProgress(null);
    }
  };

  const allNotificationsEnabled = 
    notificationAlerts || notificationTrades || notificationNews;


  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <Text style={styles.errorText}>No profile data available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <Text style={styles.title}>My Profile</Text>

      {/* User Information Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Information</Text>
        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{profile.username}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{profile.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{profile.phone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Member Since</Text>
          <Text style={styles.value}>{profile.member_since}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Verified</Text>
          <Text
            style={[
              styles.value,
              {
                color: profile.is_verified ? colors.success : colors.error,
              },
            ]}
          >
            {profile.is_verified ? '✓ Yes' : '✗ No'}
          </Text>
        </View>
      </View>

      {/* Bank Account Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bank Account</Text>
        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Account</Text>
          <Text style={styles.value}>{profile.bank_account}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Status</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  profile.bank_account_status === 'verified'
                    ? colors.success
                    : colors.warning,
              },
            ]}
          >
            {profile.bank_account_status}
          </Text>
        </View>
      </View>

      {/* Notification Preferences Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notification Preferences</Text>
        <View style={styles.divider} />

        <View style={styles.toggleRow}>
          <View style={styles.toggleLeft}>
            <Text style={styles.toggleLabel}>All Notifications</Text>
            <Text style={styles.toggleDescription}>
              Turn all notifications off
            </Text>
          </View>
          <Switch
            value={allNotificationsEnabled}
            onValueChange={(value) =>
              handleToggleAllNotifications(value)
            }
            disabled={updateInProgress === 'all'}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={allNotificationsEnabled ? colors.success : colors.secondary}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleLeft}>
            <Text style={styles.toggleLabel}>Price Alerts</Text>
            <Text style={styles.toggleDescription}>
              Get notified about price changes
            </Text>
          </View>
          <Switch
            value={notificationAlerts}
            onValueChange={(value) => {
              setNotificationAlerts(value);
              handleNotificationToggle('notification_alerts', value);
            }}
            disabled={updateInProgress === 'notification_alerts'}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={notificationAlerts ? colors.success : colors.secondary}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleLeft}>
            <Text style={styles.toggleLabel}>Trade Updates</Text>
            <Text style={styles.toggleDescription}>
              Get notified about trade activity
            </Text>
          </View>
          <Switch
            value={notificationTrades}
            onValueChange={(value) => {
              setNotificationTrades(value);
              handleNotificationToggle('notification_trades', value);
            }}
            disabled={updateInProgress === 'notification_trades'}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={notificationTrades ? colors.success : colors.secondary}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleLeft}>
            <Text style={styles.toggleLabel}>Market News</Text>
            <Text style={styles.toggleDescription}>
              Get notified about market news
            </Text>
          </View>
          <Switch
            value={notificationNews}
            onValueChange={(value) => {
              setNotificationNews(value);
              handleNotificationToggle('notification_news', value);
            }}
            disabled={updateInProgress === 'notification_news'}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={notificationNews ? colors.success : colors.secondary}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleLeft}>
            <Text style={styles.toggleLabel}>Two-Factor Authentication</Text>
            <Text style={styles.toggleDescription}>
              Secure your account with 2FA
            </Text>
          </View>
          <Switch
            value={twoFactorEnabled}
            onValueChange={(value) => {
              setTwoFactorEnabled(value);
              handleNotificationToggle('two_factor_enabled', value);
            }}
            disabled={updateInProgress === 'two_factor_enabled'}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={twoFactorEnabled ? colors.success : colors.secondary}
          />
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

