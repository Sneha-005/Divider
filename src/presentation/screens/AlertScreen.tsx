import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { colors } from '../../shared/theme/colors';
import styles from './AlertScreen.styles';
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
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Warning: {error}</Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Price Alerts</Text>

        {/* ACTIVE ALERTS */}
        <Text style={styles.sectionTitle}>Active Alerts</Text>

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
        <Text style={styles.sectionTitle}>Create Alert</Text>

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
              <Text style={styles.createText}>CREATE ALERT</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* TRIGGERED ALERTS */}
        <Text style={styles.sectionTitle}>Triggered Alerts</Text>

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

