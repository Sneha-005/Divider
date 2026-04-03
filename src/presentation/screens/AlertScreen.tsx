import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';

interface Alert {
  id: string;
  symbol: string;
  type: 'price' | 'gain' | 'loss';
  value: string;
  enabled: boolean;
}

export const AlertScreen: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      symbol: 'RELIANCE',
      type: 'price',
      value: 'Price > ₹100',
      enabled: true,
    },
    {
      id: '2',
      symbol: 'INFY',
      type: 'gain',
      value: 'Gain > 5%',
      enabled: true,
    },
    {
      id: '3',
      symbol: 'TCS',
      type: 'loss',
      value: 'Loss < -5%',
      enabled: false,
    },
  ]);

  const toggleAlert = (id: string) => {
    setAlerts(
      alerts.map(alert =>
        alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
      )
    );
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price':
        return '💰';
      case 'gain':
        return '📈';
      case 'loss':
        return '📉';
      default:
        return '🔔';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🔔 Price Alerts</Text>
          <Text style={styles.headerSubtitle}>Manage Your Stock Notifications</Text>
        </View>

        {/* Alerts List */}
        <View style={styles.alertsContainer}>
          {alerts.map(alert => (
            <View key={alert.id} style={styles.alertCard}>
              <View style={styles.alertContent}>
                <Text style={styles.alertIcon}>{getAlertIcon(alert.type)}</Text>
                <View style={styles.alertInfo}>
                  <Text style={styles.alertSymbol}>{alert.symbol}</Text>
                  <Text style={styles.alertValue}>{alert.value}</Text>
                </View>
              </View>
              <Switch
                value={alert.enabled}
                onValueChange={() => toggleAlert(alert.id)}
                trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
                thumbColor={alert.enabled ? '#34D399' : '#E2E8F0'}
              />
            </View>
          ))}
        </View>

        {/* Empty State for No Alerts */}
        {alerts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No Alerts Set</Text>
            <Text style={styles.emptySubtext}>Create your first alert to get started</Text>
          </View>
        )}

        {/* Add Alert Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add New Alert</Text>
          </TouchableOpacity>
        </View>

        {/* Alert Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>Notification Preferences</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={true}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor="#34D399"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingText}>Email Notifications</Text>
            </View>
            <Switch
              value={false}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor="#34D399"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingText}>Sound Enabled</Text>
            </View>
            <Switch
              value={true}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor="#34D399"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  alertsContainer: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertInfo: {
    flex: 1,
  },
  alertSymbol: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  alertValue: {
    fontSize: 12,
    color: '#64748B',
  },
  emptyState: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
  },
  actionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  settingsCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    flex: 1,
  },
  settingText: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
});

export default AlertScreen;
