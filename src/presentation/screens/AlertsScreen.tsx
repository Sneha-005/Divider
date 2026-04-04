import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Alert = {
  id: string;
  symbol: string;
  condition: string;
  price: number;
  created: string;
};

export default function AlertsScreen() {
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState('');

  const activeAlerts: Alert[] = [
    {
      id: '1',
      symbol: 'RELIANCE',
      condition: '≥',
      price: 105,
      created: '1 hour ago',
    },
    {
      id: '2',
      symbol: 'TCS',
      condition: '≤',
      price: 82,
      created: '2 hours ago',
    },
  ];

  const triggeredAlerts: Alert[] = [
    {
      id: '3',
      symbol: 'INFY',
      condition: '<',
      price: 60,
      created: '4:30 PM Today',
    },
    {
      id: '4',
      symbol: 'RELIANCE',
      condition: '>',
      price: 110,
      created: '3:15 PM Today',
    },
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Price Alerts</Text>
          <Text style={styles.subtitle}>Monitor your stocks</Text>
        </View>

        {/* ACTIVE ALERTS */}
        {activeAlerts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionBadge}>
                <Text style={styles.badgeIcon}>✅</Text>
              </View>
              <Text style={styles.sectionTitle}>Active Alerts</Text>
              <Text style={styles.alertCount}>{activeAlerts.length}</Text>
            </View>

            {activeAlerts.map(item => (
              <View key={item.id} style={styles.activeCard}>
                <View style={styles.cardTop}>
                  <View>
                    <Text style={styles.symbol}>{item.symbol}</Text>
                    <View style={styles.conditionRow}>
                      <Text style={styles.condition}>{item.condition}</Text>
                      <Text style={styles.price}>₹{item.price}</Text>
                    </View>
                  </View>
                  <View style={styles.statusBadge}>
                    <View style={styles.greenDot} />
                    <Text style={styles.statusText}>ACTIVE</Text>
                  </View>
                </View>

                <Text style={styles.createdDate}>Created {item.created}</Text>

                <View style={styles.btnRow}>
                  <TouchableOpacity style={styles.editBtn}>
                    <Text style={styles.btnText}>✏️ Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn}>
                    <Text style={styles.deleteBtnText}>🗑️ Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* CREATE ALERT */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionBadge, { backgroundColor: '#FFF3CD' }]}>
              <Text style={styles.badgeIcon}>🔔</Text>
            </View>
            <Text style={styles.sectionTitle}>Create Alert</Text>
          </View>

          <View style={styles.createCard}>
            <Text style={styles.label}>Stock Symbol</Text>
            <TextInput
              placeholder="e.g., RELIANCE, TCS"
              placeholderTextColor="#bbb"
              style={styles.input}
              value={symbol}
              onChangeText={setSymbol}
            />

            <Text style={styles.label}>Price Target</Text>
            <TextInput
              placeholder="Enter target price"
              placeholderTextColor="#bbb"
              style={styles.input}
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />

            <TouchableOpacity 
              style={styles.createBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.createText}>+ CREATE ALERT</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TRIGGERED ALERTS */}
        {triggeredAlerts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionBadge, { backgroundColor: '#F8D7DA' }]}>
                <Text style={styles.badgeIcon}>🔴</Text>
              </View>
              <Text style={styles.sectionTitle}>Triggered Alerts</Text>
              <Text style={styles.alertCount}>{triggeredAlerts.length}</Text>
            </View>

            {triggeredAlerts.map(item => (
              <View key={item.id} style={styles.triggeredCard}>
                <View style={styles.cardTop}>
                  <View>
                    <Text style={styles.symbol}>{item.symbol}</Text>
                    <View style={styles.conditionRow}>
                      <Text style={styles.condition}>{item.condition}</Text>
                      <Text style={styles.price}>₹{item.price}</Text>
                    </View>
                  </View>
                  <View style={styles.triggeredBadge}>
                    <View style={styles.redDot} />
                    <Text style={styles.triggeredText}>TRIGGERED</Text>
                  </View>
                </View>
                <Text style={styles.createdDate}>Triggered {item.created}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },

  section: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  badgeIcon: {
    fontSize: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },

  alertCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: '#6B7280',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },

  activeCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  createCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  triggeredCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#EF4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  symbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },

  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  condition: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },

  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  triggeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  greenDot: {
    width: 8,
    height: 8,
    backgroundColor: '#10B981',
    borderRadius: 4,
    marginRight: 6,
  },

  redDot: {
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 12,
  },

  triggeredText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 12,
  },

  createdDate: {
    color: '#9CA3AF',
    fontSize: 13,
    marginBottom: 12,
    fontWeight: '500',
  },

  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },

  editBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnText: {
    fontWeight: '700',
    color: '#374151',
    fontSize: 13,
  },

  deleteBtnText: {
    fontWeight: '700',
    color: '#DC2626',
    fontSize: 13,
  },

  label: {
    marginTop: 16,
    fontWeight: '700',
    color: '#1F2937',
    fontSize: 14,
  },

  input: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
    backgroundColor: '#F9FAFB',
  },

  createBtn: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  createText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },

  bottomPadding: {
    height: 30,
  },
});