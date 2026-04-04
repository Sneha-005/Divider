import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const ProfileScreen = () => {
  const [settings, setSettings] = useState({
    alerts: true,
    trades: true,
    news: false,
    twoFA: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>H</Text>
        </View>

        <Text style={styles.name}>Harsh</Text>
        <Text style={styles.email}>harsh@example.com</Text>
      </View>

      {/* Bank Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Bank Account</Text>
        <Text style={styles.bank}>HDFC Bank - Savings</Text>
        <Text style={styles.account}>**** 1234</Text>
        <Text style={styles.verified}>✔ Verified</Text>
      </View>

      {/* Settings */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.row}>
          <Text>Alerts</Text>
          <Switch value={settings.alerts} onValueChange={() => toggle('alerts')} />
        </View>

        <View style={styles.row}>
          <Text>Trades</Text>
          <Switch value={settings.trades} onValueChange={() => toggle('trades')} />
        </View>

        <View style={styles.row}>
          <Text>News</Text>
          <Switch value={settings.news} onValueChange={() => toggle('news')} />
        </View>
      </View>

      {/* Security */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Security</Text>

        <View style={styles.row}>
          <Text>Two Factor Authentication</Text>
          <Switch value={settings.twoFA} onValueChange={() => toggle('twoFA')} />
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },

  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#3b5bdb',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  avatar: {
    backgroundColor: '#fff',
    height: 70,
    width: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b5bdb',
  },

  name: {
    fontSize: 20,
    color: '#fff',
    marginTop: 10,
    fontWeight: 'bold',
  },

  email: {
    color: '#dfe4ff',
  },

  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },

  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },

  bank: {
    fontSize: 15,
  },

  account: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },

  verified: {
    color: 'green',
    fontWeight: '600',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },

  logout: {
    margin: 20,
    backgroundColor: '#ff4d4f',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});