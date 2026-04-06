import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { colors } from '../../shared/theme/colors';
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

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleNotificationToggle = async (
    key: string,
    value: boolean
  ) => {
    try {
      await updateNotificationPreference(key as keyof typeof profile, value);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Update failed';
      Alert.alert('Error', errorMessage);
    }
  };


  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>No profile data available</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
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
            <Text style={styles.toggleLabel}>Price Alerts</Text>
            <Text style={styles.toggleDescription}>
              Get notified about price changes
            </Text>
          </View>
          <Switch
            value={profile.notification_alerts}
            onValueChange={(value) =>
              handleNotificationToggle('notification_alerts', value)
            }
            disabled={updatingNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={profile.notification_alerts ? colors.success : colors.secondary}
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
            value={profile.notification_trades}
            onValueChange={(value) =>
              handleNotificationToggle('notification_trades', value)
            }
            disabled={updatingNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={profile.notification_trades ? colors.success : colors.secondary}
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
            value={profile.notification_news}
            onValueChange={(value) =>
              handleNotificationToggle('notification_news', value)
            }
            disabled={updatingNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={profile.notification_news ? colors.success : colors.secondary}
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
            value={profile.two_factor_enabled}
            onValueChange={(value) =>
              handleNotificationToggle('two_factor_enabled', value)
            }
            disabled={updatingNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={profile.two_factor_enabled ? colors.success : colors.secondary}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },

  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 20,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },

  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: 14,
  },

  infoRow: {
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },

  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },

  toggleLeft: {
    flex: 1,
  },

  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },

  toggleDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },

  errorText: {
    fontSize: 16,
    color: colors.error,
  },

  // Badge styles
  badgeSuccess: {
    backgroundColor: colors.success,
    color: colors.text,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    fontWeight: '600',
  },

  badgeWarning: {
    backgroundColor: colors.warning,
    color: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    fontWeight: '600',
  },
});