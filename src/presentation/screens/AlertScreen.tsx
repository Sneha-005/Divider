import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../../shared/theme/colors';
import { useAlerts } from '../hooks/useAlerts';

export default function AlertsScreen() {
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  
  const { activeAlerts, triggeredAlerts, loading, creating, error, fetchAlerts, createAlert } = useAlerts();

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleCreateAlert = async () => {
    if (!symbol.trim() || !price.trim()) {
      Alert.alert('Validation', 'Please fill in all fields');
      return;
    }

    try {
      await createAlert(symbol, parseFloat(price), condition);
      setSymbol('');
      setPrice('');
      setCondition('ABOVE');
    } catch (err) {
      console.error('Error creating alert:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Price Alerts</Text>

        {/* ACTIVE ALERTS */}
        <Text style={styles.sectionTitle}>✅ Active Alerts</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading alerts...</Text>
          </View>
        ) : (activeAlerts && activeAlerts.length > 0) ? (
          activeAlerts.map((item, index) => (
            <View key={item.alertId || `active-${index}`} style={styles.activeCard}>
              <Text style={styles.symbol}>
                {item.symbol} {item.getDisplayCondition()} ₹{item.thresholdPrice.toFixed(2)}
              </Text>

              <Text style={styles.sub}>Created: {item.getFormattedTime()}</Text>

              <View style={styles.statusRow}>
                <View style={styles.greenDot} />
                <Text style={styles.active}>ACTIVE</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No active alerts</Text>
        )}

        {/* CREATE ALERT */}
        <Text style={styles.sectionTitle}>🔔 Create Alert</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Stock Symbol</Text>
          <TextInput
            placeholder="Enter stock (e.g. RELIANCE-CE-2900)"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            value={symbol}
            onChangeText={setSymbol}
            editable={!creating}
          />

          <Text style={styles.label}>Price Target</Text>
          <TextInput
            placeholder="100.00"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            keyboardType="decimal-pad"
            value={price}
            onChangeText={setPrice}
            editable={!creating}
          />

          <Text style={styles.label}>Condition</Text>
          <View style={styles.conditionRow}>
            <TouchableOpacity
              style={[
                styles.conditionBtn,
                condition === 'ABOVE' && styles.conditionBtnActive,
              ]}
              onPress={() => setCondition('ABOVE')}
              disabled={creating}
            >
              <Text
                style={[
                  styles.conditionText,
                  condition === 'ABOVE' && styles.conditionTextActive,
                ]}
              >
                ABOVE ≥
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.conditionBtn,
                condition === 'BELOW' && styles.conditionBtnActive,
              ]}
              onPress={() => setCondition('BELOW')}
              disabled={creating}
            >
              <Text
                style={[
                  styles.conditionText,
                  condition === 'BELOW' && styles.conditionTextActive,
                ]}
              >
                BELOW ≤
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.createBtn, creating && styles.createBtnDisabled]}
            onPress={handleCreateAlert}
            disabled={creating}
          >
            {creating ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={styles.createText}>✓ CREATE ALERT</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* TRIGGERED ALERTS */}
        <Text style={styles.sectionTitle}>🔴 Triggered Alerts</Text>

        {(triggeredAlerts && triggeredAlerts.length > 0) ? (
          triggeredAlerts.map((item, index) => (
            <View key={item.alertId || `triggered-${index}`} style={styles.triggeredCard}>
              <Text style={styles.symbol}>
                {item.symbol} {item.getDisplayCondition()} ₹{item.thresholdPrice.toFixed(2)}
              </Text>
              <Text style={styles.sub}>Triggered: {item.getFormattedTime()}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No triggered alerts</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  errorContainer: {
    backgroundColor: colors.error,
    borderRadius: 8,
    padding: 10,
    margin: 16,
    marginBottom: 12,
  },

  errorText: {
    color: colors.text,
    fontSize: 14,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.text,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: colors.text,
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },

  activeCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    borderWidth: 1,
    borderColor: colors.border,
  },

  triggeredCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    borderWidth: 1,
    borderColor: colors.border,
  },

  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },

  sub: {
    color: colors.textSecondary,
    marginTop: 5,
    fontSize: 12,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  greenDot: {
    width: 10,
    height: 10,
    backgroundColor: colors.success,
    borderRadius: 5,
    marginRight: 6,
  },

  active: {
    color: colors.success,
    fontWeight: '600',
    fontSize: 12,
  },

  label: {
    marginTop: 10,
    fontWeight: '600',
    color: colors.text,
    fontSize: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
    color: colors.text,
    backgroundColor: colors.background,
    fontSize: 14,
  },

  conditionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },

  conditionBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
  },

  conditionBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  conditionText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
  },

  conditionTextActive: {
    color: colors.background,
  },

  createBtn: {
    backgroundColor: colors.success,
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },

  createBtnDisabled: {
    opacity: 0.6,
  },

  createText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  },

  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  loadingText: {
    color: colors.textSecondary,
    marginTop: 10,
    fontSize: 12,
  },

  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    fontSize: 14,
  },
});